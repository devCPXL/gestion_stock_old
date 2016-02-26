DELETE FROM gestion_stock_mvt_x WHERE id_mvt IN (
	SELECT * FROM (
		select gsm.id_mvt
		from gestion_stock_mvt_x gsm
		left join gestion_stock gs1 on gs1.id_stock = gsm.from_id_stock 
		left join gestion_article ga1 on ga1.id_article = gs1.id_article
		left join gestion_family gf on gf.id_family = ga1.id_family

		left join gestion_stock gs2 on gs2.id_stock = gsm.to_id_stock
		-- left join gestion_article ga2 on ga2.id_article = gs2.id_article
		-- where gs1.type_stock = "MATERIAL"
		-- and gs2.type_stock = "MATERIAL"
		-- where gsm.from_id_stock = 1134 or gsm.to_id_stock = 1134
		where gs1.type_stock = "MATERIAL" or gs2.type_stock = "MATERIAL"
	) AS p
)


DELETE FROM gestion_stock WHERE id_stock IN (
	SELECT * FROM (
		select gss.id_stock from gestion_stock gss
		where gss.id_article in 
		(select distinct ga.id_article 
		from gestion_stock gs
		left join gestion_article ga on ga.id_article = gs.id_article
		left join gestion_family gf on gf.id_family = ga.id_family
		where gs.type_stock = 'MATERIAL'
		and gf.description <> 'Multiskin')
		and gss.type_stock = 'SUPPLIER' or gss.type_stock = 'MATERIAL'
	) AS p
)

delete from gestion_article where id_article in(
	SELECT * FROM (
		select id_article
		from gestion_article
		where id_family in (8,9,14,15,16,17,18)
	) AS p
)


ALTER TABLE `cpas_dev`.`gestion_article` 
ADD COLUMN `type_article` VARCHAR(50) NULL AFTER `order_article`;