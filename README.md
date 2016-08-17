

cd web
git pull --rebase # jalar cambios
git add index.html # agregar a bateria de cambios a subir
git commit -m"teaser envoltura" #agregar cambio a repo local
git push # agregar cambios al repositorio remoto (github)
gulp gh-deploy # desplegar cambios en intranerds.io
history | tail -n 20
