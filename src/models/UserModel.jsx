
export default function UserModel(){
    
};

function returnConstructor(isValid = false, message = "No Message"){
    return {
        isValid: isValid,
        message: message
    };
};

function ValidateUserObject(object){
    if(object !== typeof Object){
        return returnConstructor(false, "Not a Valid Object");
    }
    if(!object.first_name){
        return returnConstructor(false, "First Name not assigned");
    }
    if(!object.email){
        return returnConstructor(false, "email not assigned");
    }
    if(!object.institution){
        return returnConstructor(false, "institution not assigned");
    }
    if(!object.role){
        return returnConstructor(false, "role not assigned");
    }
};

async function NewUser(){
    //Create auth first
    const record_auth = await pb.collection('users')
    .create({
        username: crypto.randomUUID(),
        email: values.email,
        emailVisibility: true,
        password: 'password',
        passwordConfirm: 'password'
    });
    const record_personal_data = await pb.collection("user_personal_data")
    .create({
        user: record_auth.id,
        first_name: values.first_name,
        middle_name: values.middle_name,
        last_name: values.last_name,
        gender: values.gender,
        birthdate: values.birthdate
    });
    await pb.collection('user_relationships')
    .create({
        user_id: record_auth.id,
        institutions: [values.institution],
        personal_info: record_personal_data.id,
        roles: []
    });
}