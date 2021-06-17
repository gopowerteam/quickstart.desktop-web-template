const express = require('express')
const app = express()

// adminModule initialize code here
const sqliteAdmin = require('@juztcode/sqlite-admin')({
    database: './data/database.sqlite'
})

app.use('<admin-base-url eg: /admin>', sqliteAdmin.adminRouter)

app.listen(3000, () => {
    console.log('server started on http://localhost:8888')
})
