DROP TABLE IF EXISTS "Comunicaciones"."public"."potencia";
DROP TABLE IF EXISTS "Comunicaciones"."public"."poste";

-- ------------------------------ --
-- Table "labs"."public"."course" --
-- ------------------------------ --
CREATE TABLE IF NOT EXISTS "Comunicaciones"."public"."poste" (
    "poste_id"      SERIAL          NOT NULL,
    "latitud"       DECIMAL(25, 17)  NOT NULL,
    "longitud"      DECIMAL(25, 17)  NOT NULL,
    PRIMARY KEY ("poste_id")
);

CREATE TABLE IF NOT EXISTS "Comunicaciones"."public"."potencia" (
    "potencia_id"     SERIAL   NOT NULL,
    "potencia"        REAL      NOT NULL,
    "corriente_pico"  REAL      NOT NULL,
    "intensidad_rms"  REAL      NOT NULL,
    "energia"         REAL      NOT NULL,
    "created_at"      TIMESTAMPTZ DEFAULT Now(),
    "poste_id"        INT NOT NULL,
    CONSTRAINT "fk_poste_id"
        FOREIGN KEY ("poste_id")
            REFERENCES "Comunicaciones"."public"."poste" ("poste_id")
            ON DELETE NO ACTION
            ON UPDATE NO ACTION,
    PRIMARY KEY ("potencia_id")
);

CREATE INDEX "idx_poste_id" ON "Comunicaciones"."public"."poste" ("poste_id" ASC);
CREATE INDEX "idx_potencia_id" ON "Comunicaciones"."public"."potencia" ("potencia_id" ASC);