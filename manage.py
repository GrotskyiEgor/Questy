import Project

def main():
    try:
        # Project.load_env()
        Project.settings.socketio.run(Project.project, host='127.0.0.1', port=8001, debug = True)
    except Exception as error:
        print(f'An error: {error}')

if __name__ == "__main__":
    main()