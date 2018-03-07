import handleError from './../functions';
import User from '../models/user';
import Box from '../models/box';

const jwt = require('jsonwebtoken');
const express = require('express');
const router = express.Router(); 

router.use(checkJWT);
router.use(decodeJWT); 

router.get('/profile', function(req, res, next){
	User.findOne({
		username: req.decode.username,
		bank: req.decode.bank,
		bank_id: req.decode.bank_id
	}, function(err, doc){
		if(err) return handleError(res, err.message, "Error while fetch");
		res.status(200).json({
			username: doc.username,
			email: doc.email
		});
	});
});

router.get('/boxes', function(req, res, next){
	const boxesQuery = [
		{ 
			$match: {
				bank_id: +req.decode.bank_id,
				bank: req.decode.bank
			} 
		},
		{
			$project : { 
				size: { $concat: [
					{ $substr: ["$height", 0, 5]},
					"x",
					{ $substr: ["$width", 0, 5]},
					"x",
					{ $substr: ["$length", 0, 5]} 
				]}, 
				town: true,
				height: true,
				width: true,
				length: true,
				address: true,
				deposit: true,
				min_term: true,
				price_per_day: true,
				price_per_month: true,
				price_for_3_months: true,
				price_for_6_months: true,
				price_per_year: true,
				price_more_year: true,
				price: "$price_per_day"
			}
		}
	];
	Box.aggregate(boxesQuery).exec(
		function(err, messages){
			if(err) return handleError(res, err.message, "Error while updating data");				
			res.status(200).json(messages);
		}
	);
});

router.get('/renew', function(req, res, next){
	const token = jwt.sign({
        username: req.decode.username,
        bank_id: req.decode.bank_id,
        bank: req.decode.bank
    }, process.env.SECRET, {
        expiresIn: 1800
	});
	
    const decode = jwt.decode(token);

    res.json({
        success: true,
        token: token,
        expires_at: decode.exp * 1000
    });
});

router.post('/box', function(req, res, next){
	let box = new Box({
		bank_id: req.decode.bank_id,
		bank: req.decode.bank,
		town: req.body.town,
		price_per_day: req.body.price_per_day,
		price_per_month: req.body.price_per_month,
		price_for_3_months: req.body.price_for_3_months,
		price_for_6_months: req.body.price_for_6_months,
		price_per_year: req.body.price_per_year,
		price_more_year: req.body.price_more_year,
		height: req.body.height,
		width: req.body.width,
		length: req.body.length,
		address: req.body.address,
		deposit: req.body.deposit,
		min_term: req.body.min_term
	}); 
	box.save(function(err, result){
		if(err) return handleError(res, err.message, "Error while updating data");
		res.status(201).json({
			message: 'Saved data successfully'
		});
	});
});

router.delete("/box", function(req, res, next){
	Box.findOneAndRemove({
        "_id": req.query.id,
        "bank": req.decode.bank,
        "bank_id": req.decode.bank_id,
    }).exec(function(err, result){
		if(err) return handleError(res, err.message, "Error while updating data");
		res.status(201).json({
			message: "Deleted data successfully"
		});		
	});
});

router.put("/box", function(req, res, next){
	let newData = {
		town: req.body.town,
		price_per_day: req.body.price_per_day,
		price_per_month: req.body.price_per_month,
		price_for_3_months: req.body.price_for_3_months,
		price_for_6_months: req.body.price_for_6_months,
		price_per_year: req.body.price_per_year,
		price_more_year: req.body.price_more_year,
		height: req.body.height,
		width: req.body.width,
		length: req.body.length,
		address: req.body.address,
		deposit: req.body.deposit,
		min_term: req.body.min_term
	}
	Box.findOneAndUpdate({
        "_id": req.body._id,
        "bank": req.decode.bank,
        "bank_id": req.decode.bank_id,
    }, newData, function(err, result){
		if(err) return handleError(res, err.message, "Error while updating data");
		res.status(201).json({
			message: "Updateed data successfully"
		});		
	});
});

router.post("/test", function(req, res, next){
	const token = req.body.token || req.headers.token;
	res.status(201).json({token});
});

function checkJWT(req, res, next){
    req.token = req.body.token || req.headers.token;
    if(req.token){
        jwt.verify(req.token, process.env.SECRET, function(err, decode){
            if(err){
				console.log(err);
                res.status(500).json({message: false });
            } else {
                next();
            }
        });
    } else {
        res.send("you don't have token");
    }
}

function decodeJWT(req, res, next){
    req.decode = jwt.decode(req.token);
    next();
}

export default router;