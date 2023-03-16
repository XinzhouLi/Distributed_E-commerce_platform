const Promise = require("bluebird");
const sqlite3 = require("sqlite3");

class Database {
  async connect(dbName) {
    return new Promise((resolve, reject) => {
      this.db = new sqlite3.Database("db/" + dbName, (e) => {
        if (e) {
          reject(e);
        } else {
          resolve();
        }
      });
    });
  }

  async get(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.get(sql, params, (e, result) => {
        if (e) {
          reject(e);
        } else {
          resolve(result);
        }
      });
    });
  }

  async run(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.run(sql, params, (e) => {
        if (e) {
          reject(e);
        } else {
          resolve();
        }
      });
    });
  }
  async all(sql, params = []) {
    return new Promise((resolve, reject) => {
      this.db.all(sql, params, (e, result) => {
        if (e) {
          reject(e);
        } else {
          resolve(result);
        }
      });
    });
  }

  async close() {
    return new Promise((resolve, reject) => {
      this.db.close((e) => {
        if (e) {
          reject(e);
        } else {
          resolve();
        }
      });
    });
  }
}

exports.Database = Database;
