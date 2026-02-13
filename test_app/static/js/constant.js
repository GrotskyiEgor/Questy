const STATE_AUTHOR_START = 'authorStart';
const STATE_QUESTION = 'question';
const STATE_WAIT = 'wait';
const STATE_AUTHOR_RESULT = 'authorResultTest';
const STATE_RESULT = 'resultTest';

const SOCKET_STATE_RESULT= -1;
const SOCEKT_STATE_EXIT = -2;

const TIMER_TICK_MS = 1000;
const AFTER_TIMEOUT_DELAY_MS = 2000;
const EXTRA_TIME_SECONDS = 15;

const ANSWER_WRONG = 0;
const ANSWER_CORRECT = 1;
const ANSWER_NO_ANSWER = 2;

const VALUE_TYPE_TIME = 'time';
const VALUE_TYPE_TOKEN = 'token';

const MAX_PERCENT = 100;
const DOUGHUT_CUTOUT = '50%';
const LINE_TESION = 0.4;
const POINT_RADIUS = 5;

const COLOR_SUCCESS = '';
const COLOR_ERROR = '';
const COLOR_PRIMARY = '';

const COOKIE_STATE = 'state';
const COOKIE_TIME = 'time';
const COOKIE_CONNECTED = 'connected';
const COOKIE_USER_ANSWERS = 'userAnswers'; 
const COOKIE_USER_TIMERS = 'userTimers';
const COOKIE_USER_TOKENS = 'userTokens';
const COOKIE_RECONNECTECT = 'reconnect';
const COOKIE_AUTHOR_START = 'authorStart'

const TEXT_LEAVE_TEST = 'Покинути тест';
const TEXT_WAIT = '';

const plusImgUrl = "{{ url_for('test_app.static', filename='images/online_test/plus.png') }}";