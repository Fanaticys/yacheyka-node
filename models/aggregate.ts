const boxesQuery = function (req) {
    let match: any = { $match: {} };
	if(req.query.start_price && req.query.end_price && req.query.term) {
		match.$match[req.query.term] = {
			$gte: parseInt(req.query.start_price),
			$lte: parseInt(req.query.end_price)
		}
	}
	if(req.query.start_height && req.query.end_height){
		match.$match.height = {
			$gte: parseInt(req.query.start_height),
			$lte: parseInt(req.query.end_height)
		}
	}
	if(req.query.start_width && req.query.end_width){
		match.$match.width = {
			$gte: parseInt(req.query.start_width),
			$lte: parseInt(req.query.end_width)
		}
	}
	if(req.query.start_length && req.query.end_length){
		match.$match.length = {
			$gte: parseInt(req.query.start_length),
			$lte: parseInt(req.query.end_length)
		}
	}
	if(req.query.start_deposit && req.query.end_deposit){
		match.$match.deposit = {
			$gte: parseInt(req.query.start_deposit),
			$lte: parseInt(req.query.end_deposit)
		}
	}
	if(req.query.start_minterm && req.query.end_minterm){
		match.$match.min_term = {
			$gte: parseInt(req.query.start_minterm),
			$lte: parseInt(req.query.end_minterm)
		}
	}
	if(req.query.town && req.query.town) match.$match.town = req.query.town;
	if(req.query.selected_banks){
		let banks = req.query.selected_banks
			.split(",")
			.map( (i) => {
				return parseInt(i);
			});
		match.$match.bank_id = {
			$in: banks
		}
	}

	let project: any = {
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
			bank_id: true,
			bank: true,
			price_per_day: true,
			price_per_month: true,
			price_for_3_months: true,
			price_for_6_months: true,
			price_per_year: true,
			price_more_year: true
		}
	};
	project.$project.price =  req.query.term ? "$" + req.query.term : "$price_per_day";

    let query = [ match,  project];

    return query;
}

const rangeValuesQuery = function () {
	let query = [
		{ 
			$project: {
				minPrice: {
					$min: [
						"$price_per_day", "$price_per_month", "$price_for_3_months", "$price_for_6_months", "$price_per_year", "$price_more_year"
					]
				},
				maxPrice: {
					$max: [
						"$price_per_day", "$price_per_month", "$price_for_3_months", "$price_for_6_months", "$price_per_year", "$price_more_year"
					]
				},
				height: true,
				width: true,
				length: true,
				deposit: true,
				min_term: true
			}
		},
		{
			$group: {
				_id: null,
				maxPrice: { $max: "$maxPrice" },
				minPrice: { $min: "$minPrice" },
				maxHeight: { $max: "$height" },
				minHeight: { $min: "$height" },
				maxWidth: { $max: "$width" },
				minWidth: { $min: "$width" },
				maxLength: { $max: "$length" },
				minLength: { $min: "$length" },
				maxDeposit: { $max: "$deposit" },
				minDeposit: { $min: "$deposit" },
				maxMinTerm: { $max: "$min_term" },
				minMinTerm: { $min: "$min_term" },
			} 
		}
	];
	return query;
}

const banksQuery = function () {
	let query = [
		{
			$group: {
				_id: "$bank",
				value: {
					$first: "$bank_id"
				}
			}
		},
		{
			$project: {
				_id: false,
				name: "$_id",
				value: true
			}
		},
		{
			$sort: {
				name: 1
			}
		}
	];
	return query;
}

const townsQuery = function () {
	let query = [
		{ 
			$group: {
				_id: "$town"
			}
		},
		{
			$project: {
				_id: false,
				town: "$_id"
			}
		},
		{
			$sort: {
				town: 1
			}
		}
	];
	return query;
}

export {
	boxesQuery,
	rangeValuesQuery,
	banksQuery,
	townsQuery
};