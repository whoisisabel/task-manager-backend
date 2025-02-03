const { exec } = require('child_process');

exec('npx prisma migrate dev --name init', (error, stdout, stderr) => {
    if (error) {
        console.error(`Migration error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`Migration stderr: ${stderr}`);
        return;
    }
    console.log(`Migration stdout: ${stdout}`);
});
