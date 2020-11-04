const { MongoClient } = require("mongodb")

const uri = process.env.MONGO_uri;

//const url = "mongodb+srv://dbPost:21010000a@cluster0.dv4ve.mongodb.net/<sistema>?retryWrites=true&w=majority";

module.exports = class Contas {

    static async userExist(collection, email) {

        const count = await collection.countDocuments({ "email": email });

        if (count === 0) {
            return false;
        }

        return true;
    }

    static async cadastrar(email, senha) {

        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        await client.connect();

        const collection = client.db("sistema").collection("contas");

        var exist = await this.userExist(collection, email);

        if (!exist) {
            await collection.insertOne({ email: email, senha: senha, charPath: "", admin: false });
            client.close();
            return true;
        }

        client.close();
        return false;

    }

    static async userExistLogin(collection, email, senha) {

        const count = await collection.countDocuments({ "email": email, "senha": senha });

        if (count === 0) {
            return false;
        }

        return true;

    }

    static async logar(email, senha) {

        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        await client.connect();

        const collection = client.db("sistema").collection("contas");

        var exist = await this.userExistLogin(collection, email, senha);

        client.close();

        if (exist) return true;

        return false;
    }

    static async isAdm(email) {

        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        await client.connect();

        const collection = client.db("sistema").collection("contas");

        const count = await collection.countDocuments({ "email": email, "admin": true }).catch( err => {
            console.log("Erro");
        })

        client.close();

        if (count > 0) return true;

        else return false;
        
    }

    static async enviaChar(email, charPath) {

        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        await client.connect();

        const collection = client.db("sistema").collection("contas");

        await collection.updateOne({ email: email }, { $set: { charPath: charPath } });

        client.close();

        await this.atualizaCharPost(email, charPath);

    }

    static async atualizaCharPost(email, charPath) {
        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        await client.connect();

        const collection = client.db("sistema").collection("posts");

        await collection.updateMany({ email: email }, { $set: { char: charPath } });

        client.close();

    }

    static async getChar(email) {

        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        await client.connect();

        const collection = client.db("sistema").collection("contas");

        return await collection.findOne({ 'email': email });

    }

    static async enviaPost(titulo, conteudo, email) {

        const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

        await client.connect();

        const collection = client.db("sistema").collection("posts");

        var charPath = this.getChar(email);

        charPath = charPath.charPath;

        collection.insertOne({ titulo: titulo, conteudo: conteudo, char: charPath, email: email }, 
            function (err, response) {
            
            if (err) {
                console.log("Erro na inserção do post no banco!");
            }

            else {
                console.log("Post inserido no banco!");
            }

            client.close();
        });
    }

    static async getPosts(busca) {

    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

    await client.connect();

    const collection = client.db("sistema").collection("posts");

    if (busca) return await collection.find({ conteudo: { '$regex': busca } }).toArray();

    return await collection.find().toArray();
}

}

