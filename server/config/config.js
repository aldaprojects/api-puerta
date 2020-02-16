process.env.PORT = process.env.PORT || 3000;

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

let url_db;

if ( process.env.NODE_ENV === 'dev' ) {
    url_db = 'mongodb://localhost/puertadb';
} else {
    url_db = 'mongodb+srv://aldair:U87sJjtcdl8YHbge@apipuerta-fcejs.mongodb.net/puertadb';
}

process.env.URL_DB = url_db;