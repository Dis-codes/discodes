import { QuickDB, MongoDriver } from "quick.db";
import { mongo_URI } from "$env/static/private";

async function connect() {
	const mongoDriver = new MongoDriver(mongo_URI);
	await mongoDriver.connect();
	const db = new QuickDB({ driver: mongoDriver });
	await db.init();
	console.log("Connected to the database");
	return db;
}
export default connect;

// code for client

/*
import  connect  from "$lib/mongo";
(async () => {
const db = await connect();
(await db.tableAsync("collectionName")).set("ID", <content>)
await db.get("ID")
await db.all()
})();

*/