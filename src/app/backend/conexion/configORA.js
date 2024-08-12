const oracledb = require('oracledb');

cns = {
    user: "angel_farmacia",
    password: "123",
    connectString: "192.168.1.125/xepdb1"
}


async function Open(sql, binds, autoCommit) {
    let cnn = await oracledb.getConnection(cns);
    let result = await cnn.execute(sql, binds, { autoCommit });
    cnn.release();
    return result;
}

exports.Open = Open;