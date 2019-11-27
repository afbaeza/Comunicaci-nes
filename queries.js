const pg = require('./conecctions/pg');

exports.module = {
    postesData: null,
    postes: async function(){
        exports.module.postesData = await pg.query('SELECT * FROM public.poste');
        
        var {rows} = exports.module.postesData;
        exports.module.postesData = rows;
        console.log(rows)
    }
}