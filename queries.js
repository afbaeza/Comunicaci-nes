const pg = require('./conecctions/pg');

exports.module = {
    postesData: null,
    postes: async function() {
        exports.module.postesData = await pg.query('SELECT * FROM public.poste');
        
        var {rows} = exports.module.postesData;
        exports.module.postesData = rows;
    },
    medicion: null,
    getMedicion: async function(id) {
        exports.module.medicion = await pg.query(`
            SELECT potencia_id, potencia, created_at, poste_id, corriente_pico, intensidad_rms
            FROM public.potencia NATURAL JOIN public.poste
            WHERE poste_id=$1;
        `, [id]);
        
        var {rows} = exports.module.medicion;
        exports.module.medicion = rows;
    },
    insertMedicion: async function(poste_id, ip, irms, potencia) {
        await pg.query(`
            INSERT INTO public.potencia(
            potencia, poste_id, corriente_pico, intensidad_rms)
            VALUES ($1, $2, $3, $4);
        `, [potencia, poste_id, ip, irms]);
    },
    registrarPoste: async function(lat, lon) {
        var result = await pg.query(`
            INSERT INTO public.poste(
                latitud, longitud)
                VALUES ($1, $2)  RETURNING poste_id;
        `, [lat, lon]);
        var {rows} = result;
        var id = rows[0].poste_id;
        return id;
    }
}