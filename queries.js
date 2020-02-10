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
        var result = await pg.query(`
            SELECT potencia_id, potencia, created_at, poste_id, corriente_pico, intensidad_rms, energia
            FROM public.potencia NATURAL JOIN public.poste
            WHERE poste_id=$1;
        `, [id]);

        if(result) {
            var {rows} = result;
            if(rows.length > 0) {
                exports.module.medicion = rows[0];
            } else {
                exports.module.medicion = {
                    potencia: 0.0,
                    corriente_pico: 0.0,
                    intensidad_rms: 0.0,
                    energia: 0.0
                }
            }
        }
    },
    insertMedicion: async function(poste_id, ip, irms, potencia, energia) {
        await pg.query(`
            INSERT INTO public.potencia(
            potencia, poste_id, corriente_pico, intensidad_rms, energia)
            VALUES ($1, $2, $3, $4, $5);
        `, [potencia, poste_id, ip, irms, energia]);
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
    },
    getEnergiaAcumulada: async function(poste_id) {
        var result = await pg.query(`
            SELECT sum(energia) as energia_acumulada
            FROM public.potencia
            WHERE poste_id=$1;
        `, [poste_id])

        if(result) {
            var { rows } = result;

            if(rows.length > 0) {
                return rows[0];
            }
        }
        return {energia_acumulada: 0.0};
    }
}