function createDataset(fields, constraints, sortFields) {
	var dataset = DatasetBuilder.newDataset();
	var codcoligada = 14;

	dataset.addColumn("usuario");
	dataset.addColumn("senha");
	dataset.addColumn("base64");


	try {
		var str = "SVC_FLUIG|Totvs@2024";
		var bytes = [];

		for (var i = 0; i < str.length; ++i) {
			bytes.push(str.charCodeAt(i));
		}

		var senha = java.util.Base64.getEncoder().encodeToString(bytes);
		dataset.addRow([ "svc_identity", "QHd18@miYP", senha]);

	} catch (erro) {
		dataset.addRow([ erro ]);
	}
	return dataset;
}