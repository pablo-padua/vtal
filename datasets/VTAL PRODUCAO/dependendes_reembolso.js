function createDataset(fields, constraints, sortFields) {
    var newDataset = DatasetBuilder.newDataset();
    newDataset.addColumn("CHAPA");
    newDataset.addColumn("NRODEPEND");
    newDataset.addColumn("NOME");
    newDataset.addColumn("SEXO");
    newDataset.addColumn("GRAUPARENTESCO");
    newDataset.addColumn("ESTADOCIVIL");
    newDataset.addColumn("DTNASCIMENTO");
    newDataset.addColumn("CPF");
    newDataset.addColumn("GRAUDEINSTRUCAO");
    newDataset.addColumn("UNIVERSITARIO");
    newDataset.addColumn("LOCALNASCIMENTO");
    newDataset.addColumn("ASSODO");
    newDataset.addColumn("ASSMED");
    newDataset.addColumn("INCIRRF");
    newDataset.addColumn("AUXMEDICAMENTO");
    newDataset.addColumn("NUMDECLARANASCVIVO");
    newDataset.addColumn("NOMEMAE");
    newDataset.addColumn("RECEBEAUXPCD");
    newDataset.addColumn("DTINCLUSAOASSMED");
    newDataset.addColumn("DTEXCLUSAOASSMED");
    newDataset.addColumn("DTINCLUSAOASSODO");
    newDataset.addColumn("DTEXCLUSAOASSODO");
    newDataset.addColumn("DTINCLUSAOAUXMED");
    newDataset.addColumn("DTEXCLUSAOAUXMED");
    newDataset.addColumn("DTINCLUSAOIR");
    newDataset.addColumn("DTEXCLUSAOIR");
    
    
    var fields = [];
	for (let i = 0; i < newDataset.columnsCount; i++) {
		fields.push(newDataset.getColumnName(i));
	}
	
	newDataset.addColumn("ultimoID");
	
    var processo = getConstraint(constraints, "processo");
     var parentesco;
    
    if(processo == "inclusaoDependente"){
       parentesco = ["1","3","5","C","N","D"]
    } else{
        parentesco = ["1","3"]
    }
    var idExterno = getConstraint(constraints, "idExterno");
    
    var constraintsDependentes = []
    constraintsDependentes.push(DatasetFactory.createConstraint("idExterno", idExterno, idExterno, ConstraintType.MUST))
    constraintsDependentes.push(DatasetFactory.createConstraint("codConsulta", "FLUIG_INTGR01", "FLUIG_INTGR01", ConstraintType.MUST))
    var dependentes = DatasetFactory.getDataset("ds_consulta_dependentes_rm", null, constraintsDependentes, null);
    
    var maiorNroDepend = -1; 
    
    // Encontre o maior valor de NRODEPEND antes do loop principal
    for (var i = 0; i < dependentes.rowsCount; i++) {
        var nroDepend = dependentes.getValue(i, "NRODEPEND");
        
        if (nroDepend > maiorNroDepend) {
            maiorNroDepend = nroDepend;
        }
    }
    
   
    for (var i = 0; i < dependentes.rowsCount; i++) {
        
        var grauParentesco = String(dependentes.getValue(i, "GRAUPARENTESCO"));
        if (parentesco.indexOf(grauParentesco) !== -1 && grauParentesco != "6" && grauParentesco != "7") {
            var row = [];
            for (var j = 0; j < fields.length; j++) {
                var field = fields[j];
                row.push(dependentes.getValue(i, field));
            }
            
            row.push(maiorNroDepend);
            newDataset.addRow(row);
        }
    }

   
     return newDataset;
    
}

function getConstraint(constraints, filter) {
    for (var i = 0; i < constraints.length; i++) {
        if (constraints[i].fieldName == filter && constraints[i].initialValue != "") {
            return constraints[i].initialValue;
        }
    }
    return null;
}

if (!Array.prototype.filter) {
    Array.prototype.filter = function(callback, thisArg) {
        // Check if the first argument is a function
        if (typeof callback !== 'function') {
            throw new TypeError(callback + ' is not a function');
        }

        var result = []; // Array to store the filtered elements
        var array = this; // The array to operate on
        var len = array.length;

        for (var i = 0; i < len; i++) {
            // Check if the current index is valid in the array
            if (i in array) {
                var element = array[i];
                // Apply the callback to the element
                if (callback.call(thisArg, element, i, array)) {
                    result.push(element); // Add the element to the result if it passes the filter
                }
            }
        }

        return result; // Return the filtered array
    };
}
