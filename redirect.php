<?PHP
require_once('./vendor/autoload.php');
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Redirect...</title>
</head>
<body>    
    <script>
        if(sessionStorage.getItem('appId')==null){
            sessionStorage.setItem('apiKey', "<?= $_ENV['API_KEY'] ?>");
            sessionStorage.setItem('authDomain', "<?= $_ENV['AUTH_DOMAIN'] ?>");
            sessionStorage.setItem('databaseURL', "<?= $_ENV['DATABASE_URL'] ?>");
            sessionStorage.setItem('projectId', "<?= $_ENV['PROJECT_ID'] ?>");
            sessionStorage.setItem('storageBucket', "<?= $_ENV['STORAGE_BUCKET'] ?>");
            sessionStorage.setItem('messagingSenderId', "<?= $_ENV['MESSAGING_SENDER_ID'] ?>");
            sessionStorage.setItem('appId', "<?= $_ENV['APP_ID'] ?>");

            window.location.href='<?= $_ENV['APP_URL'] ?>'
            // window.location.href = 'index.html';
        }
       
       
    </script>
</body>
</html>