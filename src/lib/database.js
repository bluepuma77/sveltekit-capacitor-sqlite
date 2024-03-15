import { Capacitor } from "@capacitor/core"
import { CapacitorSQLite, SQLiteConnection } from "@capacitor-community/sqlite"
import initSqlJs from 'sql.js'

let db

export async function openDB(dbName) {
    const platform = Capacitor.getPlatform()
    if (platform == 'web') {
        console.log('openDB() - using web sqlite')
        const SQL = await initSqlJs({
            locateFile: file => `./node_modules/sql.js/dist/${file}`
        })
        db = new SQL.Database()
    } else {
        console.log('openDB() - using capacitor sqlite')
        const sqlite = new SQLiteConnection(CapacitorSQLite)
        const ret = await sqlite.checkConnectionsConsistency()
        console.log(`after checkConnectionsConsistency ${ret.result}`)

        const isConn = await sqlite.isConnection(dbName, false)
        console.log(`after isConnection ${isConn.result}`)

        if (ret.result && isConn) {
            db = await sqlite.retrieveConnection(dbName, false)
        } else {
            db = await sqlite.createConnection(dbName, false, "no-encryption", 1, false)
        }

        await db.open()
    }
    return db
}

export async function createTables() {
    let sqlstr = "CREATE TABLE IF NOT EXISTS tableTest (id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT);"
    const platform = Capacitor.getPlatform()
    if (platform == 'web') {
        const ret = await db.run(sqlstr)
        console.log('createTables() result:', ret)
    } else {
        const ret = await db.execute(sqlstr)
        console.log('createTables() result:', ret)
    }
}    

export async function initDB(dbName) {
    const db = await openDB('myDatabase')
    await createTables()
    await insertData()
}

export async function insertData() {
    let sqlstr = 'INSERT INTO tableTest(text) VALUES ("' + new Date().toISOString() + '");'
    const platform = Capacitor.getPlatform()
    if (platform == 'web') {
        const ret = await db.run(sqlstr)
        console.log('insertData() result:', ret)
    } else {
        const ret = await db.execute(sqlstr)
        console.log('insertData() result:', ret)
    }
}    

function transform(input) {
    const transformedData = input[0].values.map(value => {
        return value.reduce((acc, currentValue, index) => {
            acc[input[0].columns[index]] = currentValue;
            return acc;
        }, {});
    });
    return transformedData
}

export async function readData() {
    const platform = Capacitor.getPlatform()
    if (platform == 'web') {
        let res = await db.exec("SELECT * FROM tableTest");
        res = transform(res)
        console.log('readData() result:', JSON.stringify(res))
        return res
    } else {
        let res = await db.query("SELECT * FROM tableTest");
        res = res.values
        console.log('readData() result:', res)
        return res
    }
}
