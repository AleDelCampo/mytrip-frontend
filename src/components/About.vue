<template>
    <body>
    <div class="about-page container">
        <section class="about-intro">
            <h1>About MyTrips</h1>
            <p class="fs-5">Welcome to MyTrips! Our platform is designed to help you plan, organize, and share your travel
                experiences.</p>
        </section>

        <section class="about-mission">
            <h2>Our Mission</h2>
            <p class="fs-5">The mission of our WebApp is to have the power to manage and organize our travels in real time and share them in more and more detail with the world!!.</p>
        </section>

        <h2>Meet the little Family</h2>
        <section class="about-team d-flex">
            
            <div class="team-member" v-for="member in team" :key="member.id">
                <div class="d-flex">
                    <img :src="member.photo" alt="Team Member Photo" class="team-photo">
                    <div>
                    <span>{{ member.name }}</span> 
                    <br> 
                    <span class="fs-5">{{ member.role }}</span>
                    </div>
                </div>
                
                
                <p class="fs-5">{{ member.bio }}</p>
            </div>
        </section>

        <section class="about-technology">
            <h2>We Use for this WebApp</h2>
            <ul>
                <li>HTML5</li>
                <li>CSS</li>
                <li>JavaScript</li>
                <li>Vue.js</li>
                <li>PHP</li>
                <li>Laravel</li>
                <li>MySQL</li>
                <li>Hosted with Netlify!!</li>
            </ul>
        </section>

        <section class="about-contact">
            <h2>Get in Touch</h2>
            <p class="fs-5">If you have any questions or would like to collaborate, feel free to reach out to us at
                <br>
                <strong>alessandrodelcampo01@gmail.com</strong> & <strong>marikabarbagallo99@gmail.com</strong></p>
        </section>
    </div>
</body>
</template>

<script>
export default {
    data() {
        return {
            team: [
                {
                    id: 1,
                    name: 'Alessandro Del Campo',
                    role: 'Developer',
                    bio: 'Alessandro is the visionary behind MyTrips, with a passion for the unknown and technology, the "Artisan".',
                    photo: '/public/IoCv.jpeg'
                },
                {
                    id: 2,
                    name: 'Marika Barbagallo',
                    role: 'Photographer',
                    bio: 'Marika is responsible for the style and photographs of MyTrips, with a passion for travel, the "Artist".',
                    photo: '/public/IoCv.jpeg'
                }
            ]
        };
    }
};
</script>

<style scoped>
.about-page {
    padding: 2rem;
}

.about-intro,
.about-mission,
.about-team,
.about-technology,
.about-contact {
    margin-bottom: 4rem;
    background-color: rgba(0, 0, 0, 0.6); 
    border-radius: 15px;
    padding: 20px;
    color: white;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
}

h1, h2 {
    font-family: 'Countryside', sans-serif;
    background-color: #4a5d5e;
    padding: 10px;
    border-radius: 10px;
    color: black;
}

p, ul, li {
    background-color: rgba(0, 0, 0, 0.6);
    padding: 10px;
    border-radius: 10px;
    color: white;
}

.team-photo {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.5); 
}

body {
    background-image: url(public/Sfondo.jpg);
    background-repeat: no-repeat;
    background-size: cover;
    margin: 0;
    padding: 0;
}
</style>