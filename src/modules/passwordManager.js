let pswdCollector;

export const setPasswordCollector = func => pswdCollector = func;

export const getValidatedPswd = () => {
    // Should contain at least 8 chars
    // Should and only contain digit, letter and symbol

    let status = false;
    let pswd = pswdCollector && pswdCollector();

    if(typeof pswd === 'string') {
        pswd = pswd.trim();

        // Check the presence of unwanted characters
        const r1 = /[^\d\w!@#$%^&*.]/i;

        // Check the presence of wanted characters
        const r2 = /^(?=.*\d)(?=.*\w)(?=.*[!@#$%^&*.]).{8,}$/i;
        
        status = !r1.test(pswd) && r2.test(pswd);
    }
    
    if(status) return pswd;
    throw new Error('Invalid password');
};

// Test Password: ifdgok123*
