import * as mongoose from 'mongoose';
const Schema = mongoose.Schema;

const schema = new Schema({
	bank_id: {type: Number, required: true},
	bank: {type: String, required: true},
	town: {type: String, required: true},
	price_per_day: {type: Number, required: true},
	price_per_month: {type: Number, required: true},
	price_for_3_months: {type: Number, required: true},
	price_for_6_months: {type: Number, required: true},
	price_per_year: {type: Number, required: true},
	price_more_year: {type: Number, required: true},
	height: {type: Number, required: true},
	width: {type: Number, required: true},
	length: {type: Number, required: true},
	address: {type: String, required: true},
	deposit: {type: Number, required: true},
	min_term: {type: Number, required: true}
}); 

export default mongoose.model('Box', schema);