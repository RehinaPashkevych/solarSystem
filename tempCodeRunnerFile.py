@app.route('/moons')
def moons():
    planet_name = request.args.get('planet')
    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('SELECT * FROM moonsData WHERE extendsplanet = %s ;', (planet_name))
    moonsdata = cur.fetchall()
    cur.close()
    conn.close()
    return render_template('moons.html', moonsdata=moonsdata)