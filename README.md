<h1>Questy</h1>

<p style='text-align:  justify;'> 
    <span style="margin-left: 40px;">Цей</span> 
    проєкт був розроблений з метою ознайомлення з веб-розробкою, зокрема з використанням 
    <a href="">Flask</a>. 
    Також реалізовано роботу з WebSocket за допомогою 
    <a href="">Flask-SocketIO</a>, 
    який дозволяє передавати інформацію між користувачами через сервер. 
    Використовуючи ці технології, був створений вебсайт зі створенням тестів за допомогою ШІ та можливістю їх онлайн-проходження.Також окрім Python познайомилися та почали використовувати у роботі <a href="">JavaScript</a>.
</p>

<img src='Project/static/readme_image/screen.png'>

<h2>Зміст:</h2>
<ol>
    <li>
        <a href='#all-modules'>Модулі проєкту</a>.
    </li>
    <li>
        <a href='#download-project'>Розгортання проєкту</a>.
    </li>
    <li>
        <a href='#create-venv'>Створення віртуального оточення</a>.
        <ul>
            <li>
                <a href='#windows'>Для Windows</a>.
            </li>
            <li>
                <a href='#mac-os'>Для Mac OS</a>.
            </li>
        </ul>
    </li>
    <li>
        <a href='#download-modules'>Завантаження модулей до віртуального проєкту</a>.
        <ul>
            <li>
                <a href='#requriments'>Завантаження requriments.txt</a>.
            </li>
            <li>
                <a href='#pip-install'>Завантаження окремих модулів</a>.
            </li>
        </ul>
    </li>
    <li>
        <a href='#start-project'>Старт проєкту</a>.
    </li>
    <li>
        <a href='#base-mechanics'>Основні механіки проєкту</a>.
    </li>
    <li>
        <a href='#result'>Висновок</a>.
    </li>
</ol>

<hr>


<hr>
<h3 id='all-modules'>Модулі проєкту</h3>
    <p style='text-align:  justify;  font-size: 15px;'> 
        <a href='https://flask.palletsprojects.com/en/stable/'>Flask</a>
        — мікрофреймворк для створення веб-додатків мовою Python.<br>
        <a href='https://flask-login.readthedocs.io/en/latest/'>Flask-Login</a>
        — це розширення, забезпечує керування сеансами користувачів. Він обробляє загальні завдання входу в систему, виходу із системи та запам'ятовування сеансів користувачів протягом тривалих періодів часу.<br>
        <a href='https://pypi.org/project/Flask-Mail/'>Flask-Mail</a>
        — це розширення, дозволяє надсилати повідомлення на поштові скриньки користувачів для повідомлення інформації.<br>
        <a href="https://flask-migrate.readthedocs.io/en/latest/">Flask-Migrate</a> — розширення для керування міграціями бази даних у Flask-проєктах на основі.<br>
        <a href="https://www.sqlalchemy.org/">SQLAlchemy</a> 
        надає повний набір відомих шаблонів збереження даних корпоративного івня, розроблених для ефективного та високопродуктивного доступу до баз даних.<br>
        <a href="https://flask-socketio.readthedocs.io/en/latest/">Flask-SocketIO</a>
        — забезпечує двосторонній зв’язок у реальному часі між клієнтом і сервером.<br>
        <a href="http://flask-sqlalchemy.readthedocs.io/en/stable/">Flask-SQLAlchemy</a> 
        — ORM-інструмент для роботи з базами даних у Flask-додатках.<br>
        <a href="https://jinja.palletsprojects.com/en/stable/">Jinja2</a> 
        — шаблонізатор для HTML. Дозволяє вставляти Python-змінні безпосередньо у веб-сторінки.<br>
        <a href="https://habr.com/ru/articles/554274/">JSON</a>
        — формат для обміну даними між клієнтом і сервером.<br>
        <a href="https://matplotlib.org/">matplotlib</a> 
        — бібліотека для створення графіків на основі даних з бази.<br>
        <a href="https://ru.wikipedia.org/wiki/OpenAI">OpenAI</a>
        — використовується для взаємодії зі штучним інтелектом через API.<br>
        <a href="https://pypi.org/project/pillow/">Pillow</a> 
        — бібліотека Python для обробки та редагування зображень.<br>
        <a href="https://developer.mozilla.org/ru/docs/Web/JavaScript">JavaScript</a>
        - це мова програмування, що дозволяє негайно реагувати на дії користувача без необхідності взаємодії з сервером. Може реагувати різні події, підтримує асинхронні операції, створювати нові елементи на сторінки..<br>
    </p>

<hr>
<h3 id='download-project'>Розгортання проєкту</h3>

<p style='text-align:  justify; font-size: 15px;'> 
    Для того щоб скачати проект потрібно перейти на головну сторінку проекту в github і натиснути на зелену кнопку Code.
</p>
<img src='Project/static/readme_image/github_code.png'>

<p style='text-align:  justify; font-size: 15px;'>  
    Потім скопіювати HTTPS посилання.
</p>
<img src='Project/static/readme_image/github_url.png'>

<p style='text-align:  justify; font-size: 15px;'> 
    Після цього переходимо в будь-яку IDE на приклад Visual Studio Code, якщо немає IDE на пристрої завантажте його за цією посиланням
    <a href="https://code.visualstudio.com/">Visual Studio Code</a> 
    Також на пристрої повинен бути встановлений git щоб копіювати проекти з github, 
     <a href="https://git-scm.com/">посилання на скачування git</a>
</p>

<p style='text-align:  justify; font-size: 15px;'>  
    У верхній панелі заходимо до Terminal і натискаємо на New Terminal
</p>
<img src='Project/static/readme_image/create_terminal.png'>

<p style='text-align:  justify; font-size: 15px;'>  
    І у терміналі, що відкрився, промисуємо команду git clone і посилання скопіюване раніше
</p>

<img src='Project/static/readme_image/terminal.png'>

<hr>
<h3 id='create-venv'>Створення віртуального оточення.</h3>

<hr>
<h3 id='windows'>Для Windows</h3>

<p style='text-align:  justify; font-size: 15px;'>  
    Для того щоб створити віртуальне оточення на Windows спочатку потрібно написати в термінал python -m venv venv. А для запуску .venv\Scripts\activate.bat
</p>

<img src='Project/static/readme_image/venv_windows.png'>

<hr>
<h3 id='mac-os'>Для Mac OS</h3>

<p style='text-align:  justify; font-size: 15px;'>  
   Для того щоб створити віртуальне оточення на Mac OS спочатку потрібно написати в термінал python3 -m venv venv. А для запуску source venv\bin\activate
</p>

<img src='Project/static/readme_image/venv_mac_os.png'>

<hr>
<h3 id='download-modules'>Завантаження модулей до віртуального проєкту</h3>

<hr>
<h3 id='equriments'>Завантаження requriments.txt</h3>

<p style='text-align:  justify; font-size: 15px;'>  
    Щоб скачати всі потрібні модулі для проекту потрібно скачати requirements.txt, для цього в терміналі потрібно прописати команду pip install -r requirements.txt .
</p>

<img src='Project/static/readme_image/requirementx_win.png'>

<p style='text-align:  justify; font-size: 15px;'>  
    А на mac os команда -r requirements.txt .
</p>

<img src='Project/static/readme_image/requirementx_mac_os.png'>

<hr>
<h3 id='pip-install'>Завантаження окремих модулів</h3>

<p style='text-align:  justify; font-size: 15px;'>  
    Для встановлення окремих модулів у віртуальне оточення використовується команда у терміналі pip install назва-модуля.
</p>

<img src='Project/static/readme_image/pip.png'>

<p style='text-align:  justify; font-size: 15px;'>  
    А на mac os команда pip3 install назва-модуля.
</p>

<img src='Project/static/readme_image/pip3.png'>

<hr>
<h3 id='start-project'>Старт проєкту</h3>

<p style='text-align:  justify; font-size: 15px;'>  
    Щоб запустити проект потрібно перейти у файл manage.py і в правому верхньому кутку натиснути на трикутник Run Python File
</p>

<img src='Project/static/readme_image/run_project.png'>

<hr>
<h3 id='base-mechanics'>Основні механіки проєкту</h3>

<p style='text-align:  justify; font-size: 15px;'>  
    Можливість створювати тести, який можуть проходити інші люди на сайті, на різні теми та різною кількістю питаньм ,своєю картинкою,  роблячи запит до ШІ.
</p>

<img src='Project/static/readme_image/create_test.png'>

<p style='text-align:  justify; font-size: 15px;'>  
    Редагування назви опису тесту. Видалення та зміни питань після їх створення.
</p>

<img src='Project/static/readme_image/edit_test.png'>

<p style='text-align:  justify; font-size: 15px;'> 
    Є можливість самому проходити тест та бачити результати після проходження.
</p>

<img src='Project/static/readme_image/solo_question.png'>
<img src='Project/static/readme_image/solo_result_test.png'>

<p style='text-align:  justify; font-size: 15px;'> 
    Також є можливість проходити тести онлайн, в це кімната очікування, де можна листуватися перед початком тесту.
</p>

<img src='Project/static/readme_image/room.png'>

<p style='text-align:  justify; font-size: 15px;'> 
    І бачити свої результати в табличці після тесту, де відображається ім'я користувача, кількість правильних відповідей у ​​цифровому та відсотковому варіантах. Індивідуальні відповіді на кожне питання та загальний відсоток правильності відповіді на конкретне питання тесту.
</p>

<img src='Project/static/readme_image/online_result.png'>


<p style='text-align:  justify; font-size: 15px;'> 
    Загальне налаштування проекту
</p>

<pre><code class="language-python">
    dotenv.load_dotenv()

    GOOGLE_APP_KEY= os.getenv("GOOGLE_APP_KEY")

    project = flask.Flask(
        import_name = __name__,
        static_folder="static",
        static_url_path="/Project/",
        template_folder="templates",
        instance_path= os.path.abspath(os.path.join(__file__, '..', 'instance'))
    )

    # instance_path= os.path.abspath(os.path.join(__file__, '..', '..', 'instance'))

    project.config.update(
        MAIL_SERVER='smtp.gmail.com',
        MAIL_PORT=587,
        MAIL_USE_TLS=True,
        MAIL_USE_SSL=False,
        MAIL_USERNAME='egor115819@gmail.com',
        MAIL_PASSWORD= GOOGLE_APP_KEY,
    )
    project.secret_key = secrets.token_bytes()

    mail = Mail(project)
    socketio = SocketIO(project, cors_allowed_origins="*")

</code></pre>

<p style='text-align:  justify; font-size: 15px;'> 
    Приклад використання декоратора відображення сторінки
</p>

<pre><code class="language-python">
    @render_page(template_name = 'home.html')
    def render_home():
        list_room = Room.query.all()
        list_tests= Test.query.all()

        return {
            "list_room": list_room,
            "list_tests": list_tests
        }
</code></pre>

<img src='Project/static/readme_image/screen.png'>

<p style='text-align:  justify; font-size: 15px;'> 
    Основним феймворком у нашому проекті є Flask. Цей декоратор відповідає за відображення веб сторінок
</p>

<pre><code class="language-python">
    def render_page(template_name: str):
    def config_page(function: str):
        @wraps(function)
        def handler(*args, **kwargs):
            block_temp= ['edit_question.html', 'edit_header_test.hmtl', 'quizzes.html', 'new_quiz.html', 'edit_test.html']

            context= function(*args, **kwargs)
            
            if isinstance(context, flask.Response):
                return context


            for temp in block_temp:
                if temp == template_name and not current_user.is_teacher:
                    return flask.redirect("/")
            
            return flask.render_template(
                template_name_or_list = template_name,
                is_authorization = current_user.is_authenticated,
                username = current_user.username if current_user.is_authenticated else "", 
                is_teacher= current_user.is_teacher if current_user.is_authenticated else "",
                is_admin = current_user.is_admin if current_user.is_authenticated else "",
                **context
            )

        return handler
    return config_page
</code></pre>


<p style='text-align:  justify; font-size: 15px;'> 
    Для створення та проведення міграцій використовувалися flask_sqlalchemy, flask_migrate.
</p>

<pre><code class="language-python">
    project.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///data.db'

    db = flask_sqlalchemy.SQLAlchemy(project)

    migrate = flask_migrate.Migrate(
        app= project, 
        db = db,
        directory= os.path.abspath(os.path.join(__file__, "..", "migrations"))
        )
</code></pre>

<p style='text-align:  justify; font-size: 15px;'> 
    Функція автоматичного проведення міграцій та оновлень бази даних.
</p>

<pre><code class="language-python">
    PATH = os.path.abspath(os.path.join(__file__))
    # PATH = os.path.abspath(os.path.join(__file__))

    def load_env():
        ENV_PATH = os.path.abspath(os.path.join(__file__, "..", "..", ".env"))
        if os.path.exists(ENV_PATH):
            dotenv.load_dotenv(dotenv_path= ENV_PATH)
        if not os.path.exists(os.path.join(PATH, "Project", "migrations")):
            os.system(os.environ["INIT_COMMAND"])
        
        os.system(os.environ["MIGRATE_COMMAND"])
        os.system(os.environ["UPGRADE_COMMAND"])
</code></pre>

<p style='text-align:  justify; font-size: 15px;'> 
    Основная логика работы сервера використовуючи flask_socketio.
</p>

<pre><code class="language-python">
    users= {}

    def get_sid(username):
        for sid, name in users.items():
            if name == username:
                return sid
        
        return None

    @Project.settings.socketio.on('join')
    def handle_join(data):
        room= data['room']
        username= data['username']
        users[flask.request.sid] = username

        join_room(room)

        test= Test.query.filter_by(test_code = room).first()
        ROOM= Room.query.filter_by(test_code = room).first()

        if not ROOM:
            NEW_ROOM = Room(
                test_id= test.id,
                test_code= room,
                user_list= f'|{username}|',
                author_name= username,
                active_test= False
            )
            db.session.add(NEW_ROOM)

        else:
            new_user = f'|{username}|'
            if new_user not in ROOM.user_list:
                ROOM.user_list += new_user

        db.session.commit()

    @Project.settings.socketio.on('disconnect')
    def handle_disconnect():
        username = users.pop(flask.request.sid, None)
        users.pop(flask.request.sid, None)

        if username:
            ROOM = Room.query.filter(Room.user_list.like(f"%|{username}|%")).first()
            ROOM.user_list = ROOM.user_list.replace(f"|{username}|", "")
            db.session.commit()

            emit('user_disconnected', {
                    'msg': f'{username} отключился',
                    "username": f"{username}"
                    }, 
                to=ROOM.test_code)
</code></pre>


<p style='text-align:  justify; font-size: 15px;'>    
    І передача даних на сервер із front end
</p>

<pre><code class="language-python">
    const buttonsArrey = document.querySelectorAll(".answer")

    for (let count = 0; count < buttonsArrey.length; count++ ) {
        let button= buttonsArrey[count];
        button.addEventListener(
            type= "click" ,
            listener= function ( event ) {
                let cookie= getCookie("user_answers")
                let state= getCookie("state")
                document.cookie= `state=wait${state.replace(/\D/g, "")}; path=/`;
                if (typeof cookie === "undefined"){
                    document.cookie = `user_answers= |${button.id}|; path = /`     
                }
                else{
                    cookie= cookie + `|${button.id}|`
                    document.cookie = `user_answers = ${cookie}; path= /`
                }      
                
                socket.emit("user_answer", {
                    room: room,
                    author_name: author_name,
                    username: username,
                    answer: button.id
                });
                
                renderWaitQuestion();
            }
        )
    }
</code></pre>

<hr>
<h2 id='result'>Висновок</h3>

<p style='text-align:  justify; font-size: 18px;'>  
    <span style="margin-left: 40px;">Цей</span> 
    проєкт "Questy" став можливістю для нас познайомитись з веб-розробкою та різними технологіями, такими як Flask, Flask-SocketIO, а також інтеграцією з OpenAI для створення тестів використовуючи ШІ. Під час роботи над цим проєктом ми дізнався багато нового про веб-розробку: як працювати з базами даних, ще краще стали працювати з git, використовувати JavaScript для створення інтерактивних елементів. На сайт не тільки дає можливість створювати тести, але й дозволяє користувачам проходити їх у реальному часі, переглядати результати аналізувати свої помилки.
    <span style="margin-left: 40px;">Під</span> 
    час цього проекту ми більше розібралися як працює та JavaScript c websoket
    , анавчитися працювати з базами даних, управлінні сеансами і взаємодії між клієнтом і сервером через WebSocket.
    <span style="margin-left: 40px;">Особисті враження:</span> 
</p>

<p style='text-align:  justify; font-size: 18px;'>    
    <span style="margin-left: 40px;">Егор: у цьому проєкті я був Team Lead'ом — для мене це був перший досвід управління командою, організації зустрічей, контролю завдань і кінцевого результату. Також я вперше розробив вебсайт на Flask, навчився працювати з базою даних і передавати інформацію між користувачами за допомогою WebSocket.</span> 
</p>

<p style='text-align:  justify; font-size: 18px;'>    
    <span style="margin-left: 40px;">Давид: мені дуже сподобалась робота над цим проєктом — через командну взаємодію, цікаву тему та сам процес написання коду.Цей проєкт дав мені хорошу практику з Flask, а ще я вперше попрацював із JavaScript, з яким раніше не мав досвіду.
    Крім того, я краще розібрався з Flask SQLAlchemy та WebSocket'ами — тепер працювати з ними стало набагато зрозуміліше.</span> 
</p> 

<p style='text-align:  justify; font-size: 18px;'>    
    <span style="margin-left: 40px;">Настя: мені дуже сподобався цей проект в плані багатьох можливостей. Я мала змогу як і писати код, так і робити власний дизайн. Під час розробки проекту ми справді навчились краще розуміти з'єдання серверу з клієнтом, вивчили багато нового загалом про Javascripts та websocket.</span> 
</p>

<p style='text-align:  justify; font-size: 18px;'>    
    <span style="margin-left: 40px;">Святослав: для мене робота в цьому проекті була дуже корисною, оскільки я навчився працювати в команді, згадав роботу з гітом, навчився працювати з бд і найголовніше з flasko'ом.</span> 
</p> 


