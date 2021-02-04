const Pool = require('pg').Pool
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'scrum_poker',
    password: 'danicobe',
    port: 5432,
})
//RESTFUL FOR USER
//for POST /user to create user

// <insert id="createUser" keyColumn="id_user" keyProperty="idUser" parameterType="com.escrum.poquer.escrum.tables.Game"  useGeneratedKeys="true">
// 		INSERT INTO tuser(
// 		id_user, username, id_game, color)
// 		VALUES (default, #{username}, #{idGame}, #{color})	
// 	</insert>

const createUser = (request, response) => {
    const { username } = request.body
    pool.query('INSERT INTO tuser ("idUser",username) VALUES (default, $1) RETURNING *', [username], (error, result) => {
        if (error) {
            throw error
        }
        response.status(201).send(result.rows[0]);
    })
}

const getUser = (request, response) => {
    const idUser = request.params.id;
    pool.query('select * from tuser where "idUser" = $1', [idUser], (error, result) => {
        if (error) {
            throw error
        }
        response.status(200).send(result.rows[0]);
    })
}
//RESTFUL FOR GAME
//for POST /game to create game
// <insert id="createGame" keyProperty="idGame" keyColumn="id_game" useGeneratedKeys="true"
// 		parameterType="com.escrum.poquer.escrum.tables.Game">
// 		INSERT INTO game(id_game,name_game,
// 		limit_players, task, password)
// 		VALUES
// 		(default,#{nameGame},#{limitPlayers},#{task},#{password} )
// 	</insert>
const createGame = (request, response) => {
    const { nameGame, limitPlayers, task, password, idUser } = request.body
    pool.query('INSERT INTO GAME ("idGame", "nameGame", "limitPlayers", TASK, PASSWORD, "idUser") VALUES (default, $1, $2, $3, $4, $5) RETURNING *',
        [nameGame, limitPlayers, task, password, idUser],
        (error, result) => {
            if (error)
                throw error
            response.status(201).send(result.rows[0]);
        }
    )
}
// <select id="findGame" resultMap="resultMap"
// 		parameterType="com.escrum.poquer.escrum.tables.Game">
// SELECT id_game, name_game, limit_players, task, password
// FROM
// game
// where 1=1

// 	and id_game = #{idGame}


// 	</select>
const getGamesById = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query(`
        SELECT g."idGame", g."nameGame", g."limitPlayers", g.task, g.password, g."idGame", g."idUser",
        t."username"
        FROM
        game g
        inner join tuser t on t."idUser" = g."idUser"
        where 1=1    
        and g."idGame" = $1`, [id], (error, result) => {
        if (error)
            throw error
        response.status(200).send(result.rows[0])
    })
};
// <select id="findPlayers" resultMap="resultMap"
// parameterType="com.escrum.poquer.escrum.tables.Game">
// select c.id_card, c.id_user, c.id_game, c.value,
// c.is_ready, c.show,
// t.username, t.color
// from card c
// inner join tuser t on
// c.id_user = t.id_user
// where
// c.id_game = #{idGame}
// </select>
const getPlayers = (request, response) => {
    const id = parseInt(request.params.id);
    pool.query(`
        select c."idCard", c."idUser", c."idGame", c.value,
        c."isReady", c.show,
        t.username, t.color
        from card c
        inner join tuser t on
        c."idUser" = t."idUser"
        where
        c."idGame" = $1`, [id], (error, result) => {
        if (error)
            throw error
        response.status(200).send(result.rows)
    })
};
// <insert id="createCard" keyColumn="id_card" keyProperty="idCard" useGeneratedKeys="true">
// INSERT INTO card(
// id_card, id_user, id_game, value, is_ready, show)
// VALUES (
// default, #{idUser}, #{idGame}, #{value}, #{isReady}, 0
// )
// </insert>
const createCard = (request, response) => {
    const { idUser, idGame, value, isReady, show } = request.body
    pool.query(`
        INSERT INTO card(
        "idCard", "idUser", "idGame", value, "isReady", show)
        VALUES (
        default,$1 , $2, $3, $4, 0
        ) RETURNING * 
        `, [idUser, idGame, value, isReady]
        , (error, result) => {
            if (error)
                throw error
            response.status(201).send(result.rows[0])
        })
};


const getReady = (request, response) => {
    const idGame = request.params.id;
    pool.query(`
    update card set show = 1 where "idGame" = $1
        `, [idGame]
        , (error, result) => {

            if (error)
                throw error
            response.status(200).send();
        })
};

http://localhost:3000/game/${id}/getReady/

module.exports = {
    createUser,
    getUser,
    createGame,
    getGamesById,
    getPlayers,
    createCard,
    getReady
}