<script>
export default {
  name: 'AppFooter',

  data() {
    return {
      members: [
        {
          nome: "Alessandro Del Campo",
        }
      ],

      emails: [
        "alessandrodelcampo01@gmail.com"
      ],

      socials: [
        "fa-instagram",
        "fa-google-plus-g",
        "fa-youtube"
      ]
    }
  }
}
</script>


<template>

  <footer class="bg-body-tertiary">
    <div class="container py-5">


      <div id="footer-title">
        MyTrips
      </div>

      <div class="row row-cols-3">

        <div class="col">

          <div class="col-title">
            Members
          </div>

          <div class="components">
            <ul>
              <li v-for="member in members">  
                <div class="name">
                  {{ member.nome }}
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="col">

          <div class="col-title">
            Contact
          </div>

          <div class="emails">
            <ul>
              <li v-for="email in emails">
                {{ email }}
              </li>
            </ul>
          </div>

        </div>

        <div class="col">
          <div class="col-title">
            Social
          </div>

          <div id="social-grid">
            <div v-for="social in socials" class="icon">
              <i class="fa-brands" :class="social"></i>
            </div>

          </div>
        </div>

      </div>
    </div>

    <hr>

    <div class="container py-4">
      <h6 class="text-center mb-3">
        Come avrai già capito, questa è la mia WebApp per Trips
      </h6>

      <div id="copyright">
        Copyright© 2024, Boolean®, Alessandro Del Campo.
      </div>
    </div>

  </footer>

</template>

<style lang="scss" scoped>
#footer-title {
  font-size: 1.6em;
  font-weight: bold;

  margin-bottom: 20px;
}

.col-title {
  font-size: 1.2em;
  font-weight: 600;

  margin-bottom: 10px;
}

ul {
  margin: 0;
  padding: 0;

  display: flex;
  flex-direction: column;
  row-gap: 5px;

  font-size: .8em;
  list-style-type: none;
  opacity: .8;
}

.components {

  li {

    display: flex;
    gap: 8px;


    a {
      color: white;
      text-decoration: none;
    }
  }


}


#social-grid {

  max-width: 200px;

  display: flex;
  flex-wrap: wrap;
  gap: 10px;

  .icon {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 50px;
    height: 50px;

    border: 2px solid white;

    font-size: 1.3em;

    transition: all .3s ease-in-out;


  }

  .icon:hover {

    background-color: white;
    border: 2px solid #0dcaf0;
    color: black;

    cursor: pointer;

  }

}

#copyright {
  text-align: center;
  font-size: .7em;
  opacity: .8;
}
</style>