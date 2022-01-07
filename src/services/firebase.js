const config = require('../config/config');
console.log(config.firebase.auth_provider_x509_cert_url);


// $this -> database -> getReference('users') -> getChild($jobUser -> customer_user_id) -> getChild('jobs') -> getChild($job_id) -> update($jobs_data)