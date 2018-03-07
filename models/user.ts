import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
	username: {type: String, required: true},
    password: {type: String, required: true},
    email: {type: String, required: true},
    bank: {type: String, required: true},
    bank_id: {type: Number, required: true}
}); 

export default mongoose.model('users', schema);