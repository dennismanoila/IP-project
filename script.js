document.addEventListener('DOMContentLoaded', function() {


    ////////////////////////////////////////////////////
    // Register and Login button functionality
    ////////////////////////////////////////////////////
    const registerBtn = document.getElementById('register');
    const loginBtn = document.getElementById('login');
    const container = document.querySelector('.container'); 
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            container.classList.add("active");
        });
    }

    if (loginBtn) {
        loginBtn.addEventListener('click', () => {
            container.classList.remove("active");
        });
    }

    ////////////////////////////////////////////////////
    // Navigation buttons
    ////////////////////////////////////////////////////
    const createWorkoutButton = document.getElementById("b2");
    const viewWorkoutButton = document.getElementById("b1");

    if (createWorkoutButton) {
        createWorkoutButton.addEventListener("click", function() {
            window.location.href = "./creatework.html";
        });
    }

    if (viewWorkoutButton) {
        viewWorkoutButton.addEventListener("click", function() {
            window.location.href = "./viewwork.html";
        });
    }

    ////////////////////////////////////////////////////
    // Add exercise fields dynamically
    ////////////////////////////////////////////////////
    const addButton = document.querySelector(".a-helper");
    const inputGroup = document.querySelector(".input-group");

    if (addButton) {
        addButton.addEventListener('click', function() {
            const field1 = document.createElement("input");
            field1.type = "text";
            field1.placeholder = "Exercise Name";
            field1.className = "field-wide";

            const field2 = document.createElement("input");
            field2.type = "text";
            field2.placeholder = "Sets";
            field2.className = "field-narrow";

            const field3 = document.createElement("input");
            field3.type = "text";
            field3.placeholder = "Reps";
            field3.className = "field-narrow";

            const delBtn = document.createElement("a");
            delBtn.className = "delBtn";
            delBtn.innerHTML = "&times";

            const delBtnParent = document.createElement("div");
            delBtnParent.className = "delBtn-helper";
            delBtnParent.appendChild(delBtn);
            delBtnParent.addEventListener("click", function() {
                this.parentElement.remove();
            });

            const flex = document.createElement("div");
            flex.className = "flex-input";
            flex.appendChild(field1);
            flex.appendChild(field2);
            flex.appendChild(field3);
            flex.appendChild(delBtnParent);

            inputGroup.appendChild(flex);
        });
    }

    ////////////////////////////////////////////////////
    // Redirect to create workout page
    ////////////////////////////////////////////////////
    const addWorkoutButton = document.querySelector(".add-w-button");
    if (addWorkoutButton) {
        addWorkoutButton.addEventListener("click", function() {
            window.location.href = "./creatework.html";
        });
    }

    ////////////////////////////////////////////////////
    // Alert on creating workout
    ////////////////////////////////////////////////////
    const createWorkoutBtn = document.getElementById("createWorkoutButton");
    if (createWorkoutBtn) {

        function parseData(event){
            event.preventDefault();

            const workoutName = document.querySelector('input[name="workoutName"]').value;
            const workoutDate = document.querySelector('input[name="workoutDate"]').value;
            const exercises = [];

            document.querySelectorAll('.flex-input').forEach(inputGroup =>{
                const exerciseName = inputGroup.querySelector(".field-wide").value;
                const sets = inputGroup.querySelectorAll('.field-narrow')[0].value;
                const reps = inputGroup.querySelectorAll('.field-narrow')[1].value;

                exercises.push({ exerciseName, sets, reps });
            });

            const storedWorkouts = JSON.parse(localStorage.getItem('workouts')) || [];

            const isValid = validateWorkoutForm(workoutName, workoutDate, exercises, storedWorkouts);

            if (!isValid) 
                return;

            const workoutData = {workoutName, workoutDate, exercises};
            let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
            workouts.push(workoutData);
            localStorage.setItem('workouts', JSON.stringify(workouts));
            
            window.location.href = './viewwork.html';
        }
        createWorkoutBtn.addEventListener("click", parseData);
    }

    const workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    const workoutsListContainer = document.querySelector('.workouts-list');

    workouts.forEach(workout => {
        const parentDiv = document.createElement('div');
        parentDiv.className = 'workout-title-date';
        
        parentDiv.innerHTML = `
        <p class="wdate">${workout.workoutDate}</p>
        <p class="wname">${workout.workoutName}</p>
        `;

        const hiddenDataDiv = document.createElement('div');
        hiddenDataDiv.className = 'hidden-data';

        const workoutExercises = workout.exercises;
        workoutExercises.forEach(exercise =>{
            const exName = exercise.exerciseName;
            const exSets = exercise.sets;
            const exReps = exercise.reps;

            const exGroup = document.createElement('div');
            exGroup.className = 'exercise-group';

            exGroup.innerHTML = `
            <p class="exName">${exName}</p>
            <p class="exSets">${exSets}</p>
            <p class="exReps">${exReps}</p>
            `;

            hiddenDataDiv.appendChild(exGroup);

        });
        parentDiv.appendChild(hiddenDataDiv);
        workoutsListContainer.appendChild(parentDiv);
    });

    ////////////////////////////////////////////////////
    // Modifying the list
    ////////////////////////////////////////////////////

    const workoutDiv = document.querySelectorAll('.workout-title-date');
    workoutDiv.forEach(div =>{
        div.addEventListener("click", function(){
            const exDate = this.querySelector('.wdate').innerHTML;
            const exName = this.querySelector('.wname').innerHTML;
            const exercises = [];
            this.querySelectorAll('.exercise-group').forEach(index =>{
                const e1 = index.querySelector('.exName').innerHTML;
                const e2 = index.querySelector('.exSets').innerHTML;
                const e3 = index.querySelector('.exReps').innerHTML;
                exercises.push({e1, e2, e3});
            });
            console.log(exDate);
            console.log(exName);
            console.log(exercises);

            const date = document.querySelector(".workout-exercises-container > h4");
            date.innerHTML = exDate;

            const title = document.querySelector(".workout-exercises-container > h2");
            title.innerHTML = exName;

            const exerciseList = document.querySelector(".workout-exercises");
            exerciseList.innerHTML = "";

            exercises.forEach(exercise => {
                const li = document.createElement("li");
                li.innerHTML = `
                    <div class="flex-item">
                        <p>${exercise.e1}</p>
                        <p>${exercise.e2} sets</p>
                        <p>${exercise.e3} reps</p>
                    </div>
                `;
                exerciseList.appendChild(li);
            });
        });
    });
});

    ////////////////////////////////////////////////////
    // Validating form
    ////////////////////////////////////////////////////

    function validateWorkoutForm(workoutName, workoutDate, exercises, storedWorkouts) {
        if (!workoutName.trim()) {
            alert("Workout name cannot be empty.");
            return false;
        }
    
        if (!/^[a-zA-Z]/.test(workoutName.trim())) {
            alert("Workout name must start with a letter.");
            return false;
        }
    
        if (storedWorkouts.some(workout => workout.workoutName === workoutName.trim())) {
            alert(`The workout name "${workoutName}" already exists. Please choose a unique name.`);
            return false;
        }
    
        if (!workoutDate.trim()) {
            alert("Workout date cannot be empty.");
            return false;
        }
    
        if (exercises.length === 0) {
            alert("At least one exercise is required.");
            return false;
        }
    
        for (let i = 0; i < exercises.length; i++) {
            const { exerciseName, sets, reps } = exercises[i];
    
            if (!exerciseName.trim()) {
                alert(`Exercise ${i + 1} name cannot be empty.`);
                return false;
            }
    
            if (!/^\d+$|^\d+-\d+$/.test(sets)) {
                alert(`Sets for exercise ${i + 1} must be a number or in a range format. (example: 10-12)`);
                return false;
            }
    
            if (!/^\d+$|^\d+-\d+$/.test(reps)) {
                alert(`Reps for exercise ${i + 1} must be a number or in a range format. (example: 10-12)`);
                return false;
            }
        }
    
        return true;
    }

    ////////////////////////////////////////////////////
    // Deleting workout
    ////////////////////////////////////////////////////

    document.addEventListener('DOMContentLoaded', function() {
        ////////////////////////////////////////////////////
        // Delete Workout Functionality
        ////////////////////////////////////////////////////
        const deleteWorkoutButton = document.getElementById("deleteWorkoutButton");
        const addWorkoutButton = document.getElementById("addWorkoutButton");
        const workoutTitle = document.getElementById("workoutTitle");
        const workoutsListContainer = document.querySelector('.workouts-list');
    
        let deleteMode = false; // Track whether we are in delete mode
    
        if (deleteWorkoutButton) {
            deleteWorkoutButton.addEventListener("click", function() {
                if (deleteMode) {
                    deleteMode = false;
                    workoutTitle.textContent = "Your workouts";
                    deleteWorkoutButton.textContent = "Delete Workout";
                    addWorkoutButton.classList.remove("disabled");
                } else {
                    deleteMode = true;
                    workoutTitle.textContent = "Choose Workout";
                    deleteWorkoutButton.textContent = "Cancel";
                    addWorkoutButton.classList.add("disabled");
                }
            });
        }
    
        if (workoutsListContainer) {
            workoutsListContainer.addEventListener("click", function(event) {
                const clickedDiv = event.target.closest('.workout-title-date');
    
                if (!clickedDiv) return; 
    
                if (deleteMode) {
                    const workoutName = clickedDiv.querySelector('.wname').innerText;
                    const workoutDate = clickedDiv.querySelector('.wdate').innerText;
    
                    let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
                    workouts = workouts.filter(workout =>
                        !(workout.workoutName === workoutName && workout.workoutDate === workoutDate)
                    );
                    localStorage.setItem('workouts', JSON.stringify(workouts));
    
                    clickedDiv.remove();
    
                    const date = document.querySelector(".workout-exercises-container > h4");
                    const title = document.querySelector(".workout-exercises-container > h2");
                    const exerciseList = document.querySelector(".workout-exercises");
    
                    date.innerHTML = ""; // Clear the date
                    title.innerHTML = ""; // Clear the title
                    exerciseList.innerHTML = ""; // Clear the exercise list
    
                    deleteMode = false;
                    workoutTitle.textContent = "Your workouts";
                    deleteWorkoutButton.textContent = "Delete Workout";
                    addWorkoutButton.classList.remove("disabled");
                }
            });
        }
    });
    
    ////////////////////////////////////////////////////
    // Login functionality for admin user
    ////////////////////////////////////////////////////
    const loginForm = document.querySelector('.sign-in form');
    const emailInput = loginForm.querySelector('input[type="email"]');
    const passwordInput = loginForm.querySelector('input[type="password"]');
    const loginButton = loginForm.querySelector('button');

    loginButton.addEventListener('click', function(event) {
        event.preventDefault();
        const email = emailInput.value.trim();
        const password = passwordInput.value.trim();

        if (email === 'admin@gmail.com' && password === '1234admin1234') {
            alert('Login successful!');
            window.location.href = './welcome.html';
        } else {
            alert('Invalid username or password.');
        }
    });
}
