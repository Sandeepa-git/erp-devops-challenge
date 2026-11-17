const pool = require('../config/db');

class ERPModel {

    // Orders read operations
    async getAllOrders(status = 'All', page = 1, limit = 10) {
        const offset = (page - 1) * limit;
        let query, countQuery, params, countParams;

        if (status === 'All') {
            countQuery = 'SELECT COUNT(*)::int AS count FROM orders';
            countParams = [];
            query = `SELECT o.*, i.item_name
                     FROM orders o JOIN inventory i ON o.item_id = i.id
                     ORDER BY o.created_at DESC LIMIT $1 OFFSET $2`;
            params = [limit, offset];
        } else {
            countQuery = 'SELECT COUNT(*)::int AS count FROM orders WHERE status = $1';
            countParams = [status];
            query = `SELECT o.*, i.item_name
                     FROM orders o JOIN inventory i ON o.item_id = i.id
                     WHERE o.status = $1
                     ORDER BY o.created_at DESC LIMIT $2 OFFSET $3`;
            params = [status, limit, offset];
        }

        const [countRes, dataRes] = await Promise.all([
            pool.query(countQuery, countParams),
            pool.query(query, params)
        ]);

        const total = countRes.rows[0].count;
        return {
            orders: dataRes.rows,
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }

    async getOrderCounts() {
        const { rows } = await pool.query(
            `SELECT status, COUNT(*)::int AS count FROM orders GROUP BY status`
        );
        const counts = { All: 0, Pending: 0, Approved: 0, Completed: 0, Canceled: 0, Returned: 0 };
        rows.forEach(r => { counts[r.status] = r.count; counts.All += r.count; });
        return counts;
    }

    async getOrderById(id) {
        const { rows } = await pool.query(
            `SELECT o.*, i.item_name FROM orders o JOIN inventory i ON o.item_id = i.id WHERE o.id = $1`,
            [id]
        );
        return rows[0] || null;
    }

    async createOrder(data) {
        const client = await pool.connect();
        try {
            await client.query('BEGIN');

            const orderId = `ORD-${String(Math.floor(10000 + Math.random() * 90000))}`;

            const itemRes = await client.query('SELECT * FROM inventory WHERE id = $1', [data.item_id]);
            if (itemRes.rows.length === 0) throw new Error('Inventory item not found');
            const item = itemRes.rows[0];

            const { rows } = await client.query(
                `INSERT INTO orders (order_id, customer_name, status, item_id, req_qty, part_number, due_date)
                 VALUES ($1, $2, 'Pending', $3, $4, $5, $6) RETURNING *`,
                [orderId, data.customer_name, data.item_id, data.req_qty, item.part_number, data.due_date]
            );

            await client.query('COMMIT');
            return rows[0];
        } catch (err) {
            await client.query('ROLLBACK');
            throw err;
        } finally {
            client.release();
        }
    }

    // Inventory operations
    async getAllInventory() {
        const { rows } = await pool.query(
            'SELECT * FROM inventory ORDER BY category ASC, item_name ASC'
        );
        return rows;
    }

    async getLowStockItems() {
        const { rows } = await pool.query(
            'SELECT * FROM inventory WHERE qty < reorder_level ORDER BY (qty::float / NULLIF(reorder_level,0)) ASC'
        );
        return rows;
    }

    // Dashboard metrics
    async getDashboardMetrics() {
        const client = await pool.connect();
        try {
            const [revRes, activeRes, lowRes, invRes, pendRes] = await Promise.all([
                client.query(`SELECT COALESCE(SUM(o.req_qty * i.unit_price), 0)::float AS total_revenue
                              FROM orders o JOIN inventory i ON o.item_id = i.id
                              WHERE o.status IN ('Approved','Completed')`),
                client.query(`SELECT COUNT(*)::int AS active_orders FROM orders WHERE status IN ('Pending','Approved')`),
                client.query(`SELECT COUNT(*)::int AS low_stock_count FROM inventory WHERE qty < reorder_level`),
                client.query(`SELECT COALESCE(SUM(qty * unit_price), 0)::float AS inventory_value FROM inventory`),
                client.query(`SELECT COUNT(*)::int AS pending_orders FROM orders WHERE status = 'Pending'`)
            ]);

            return {
                totalRevenue:   revRes.rows[0].total_revenue,
                activeOrders:   activeRes.rows[0].active_orders,
                lowStockCount:  lowRes.rows[0].low_stock_count,
                inventoryValue: invRes.rows[0].inventory_value,
                pendingOrders:  pendRes.rows[0].pending_orders
            };
        } finally {
            client.release();
        }
    }

    async getMonthlySalesTrends() {
        const { rows } = await pool.query(`
            SELECT TO_CHAR(o.created_at, 'Mon')          AS month,
                   EXTRACT(MONTH FROM o.created_at)::int  AS month_num,
                   COUNT(*)::int                          AS order_count,
                   COALESCE(SUM(o.req_qty * i.unit_price), 0)::float AS revenue
            FROM orders o
            JOIN inventory i ON o.item_id = i.id
            WHERE o.status IN ('Approved','Completed')
              AND o.created_at >= NOW() - INTERVAL '6 months'
            GROUP BY 1, 2
            ORDER BY month_num
        `);
        return rows;
    }
}

module.exports = new ERPModel();
