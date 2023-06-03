<template>
  <div>
    <h1>Setting up Streetcar</h1>

    <h2>Adding the bot</h2>
    <p>
      Join <router-link to="https://discord.gg/2zNMerzUEA>https://discord.gg/2zNMerzUEA</router-link> and post your request in the bot-requests form,
      following the instructions in the post guidelines. The requirements for Streetcar are in the #requirements channel.
      
      Basically, you can only get Streetcar if dalk#0010 is a admin in your server, the owner of the server has dalk#0010 added, and 30+ members.
      
      If accepted, you will be given the User role, and in the instructions channel, there will be an invite for Streetcar. If your post was deleted, you were denied. 
      You can reapply if there is some change in your server.
    </p>

    <div class="px-3 py-2 rounded bg-gray-800 shadow-md inline-block">
      <alert class="inline-icon mr-1 text-yellow-300" title="Note!" />
      If your server is not on the whitelist, Streetcar will instantly leave your server.
    
    </div>
    <h2>Configuration</h2>
    <p>
      All Streetcar configuration is done through the dashboard by editing a YAML config file. By default, only the server
      owner has access to this, but they can give other users access as they see fit. See <router-link to="/docs/configuration/configuration-format">Configuration format</router-link> for more details.
    </p>
  </div>
</template>

<script lang="ts">
  import Alert from 'vue-material-design-icons/Alert.vue';

  export default {
    components: { Alert },
  };
</script>
