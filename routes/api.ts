import handleError from './../functions';
import * as express from 'express';
import Box from '../models/box';
import * as Aggregation from '../models/aggregate';
const router = express.Router();

router.get('/boxes', function(req, res, next){
	const boxesQuery = Aggregation.boxesQuery(req);
	Box.aggregate(boxesQuery).exec(
		function(err, messages){
			if(err) return handleError(res, err.message, "Error while updating data");				
			res.status(200).json(messages);
		}
	);
});

router.get('/banks', function(req, res, next){
	const banksQuery = Aggregation.banksQuery();
	Box.aggregate(banksQuery).exec(
		function(err, messages){
			if(err) return handleError(res, err.message, "Error while updating data");
			res.status(200).json(messages);
		}
	);
});

router.get('/towns', function(req, res, next){
	const townsQuery = Aggregation.townsQuery();
	Box.aggregate(townsQuery).exec(
		function(err, messages){
			if(err) return handleError(res, err.message, "Error while updating data");
			res.status(200).json(messages);
		}
	);
});

router.get('/range-values', function(req, res, next){
	const rangeValuesQuery = Aggregation.rangeValuesQuery(); 
	Box.aggregate(rangeValuesQuery).exec(
		function(err, messages){
			if(err) return handleError(res, err.message, "Error while updating data");
			res.status(200).json(messages[0]);
		}
	);
});

export default router;