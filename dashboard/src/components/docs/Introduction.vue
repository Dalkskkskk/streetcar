<template>
  <div>
    <h1>Streetcar</h1>
    
    <!-- WIP bar -->
    <div class="px-3 py-2 rounded bg-gray-800 shadow-md inline-block">
      <alert class="inline-icon mr-1 text-yellow-300" title="Note!" />
      This documentation is a work in progress.
    </div>
    
    <p>
      Streetcar is a Discord bot cloned from Dragory's Zeppelin, a moderation bot for Discord, 
      designed with large servers and reliability in mind. Zeppelin was made to have high performance and be a highly customizable server bot. 
      The freely hosted version of Streetcar is private and only added on specific servers that are eligible. Zeppelin and Streetcar are open-source, 
      but their code does not work out of the box.
    </p>

    <h2>Use Cases</h2>
    <p>
      Here are some cases a server may use Streetcar for.
    </p>
    
    <h3>Automod</h3>
    <p>
      Streetcar's extensive auto moderator takes a huge, huge burden off of Moderators, as it has word filters and spam detection, 
      (you know, the basic stuff), and many more that can help replace multiple bots, like auto-roles, auto-responder, and much more!
      And, with the addition of the Counters plugin, you could set up a leveling system, or something that bans someone once they reach 5 cases.
    </p>
    
    <h3>Moderation</h3>
    <p>
      Streetcar's moderation (which is divided into three plugins, Mod actions, Cases, and Mutes), has detailed moderator actions, notes, 
      the ability to set your own icons for cases, and much more.
    </p>

    <h3>Logging</h3>
    <p>
      Streetcar's logging plugin can log multiple stuff.
    </p>

    <h2>Main features</h2>
    <p>
      Streetcar's main features include:
    </p>
    
    <ul>
      <li>Extensive auto moderator features (automod)</li>
      <li>Detailed moderator action tracking and notes (cases)</li>
      <li>Customizable server logs</li>
      <li>Tags/custom commands</li>
      <li>Reaction roles</li>
      <li>Tons of utility commands, including a granular member search</li>
      <li>Full configuration via a web dashboard</li>
      <li>Override specific settings and permissions on e.g. a per-user, per-channel, or per-permission-level basis</li>
      <li>Bot-managed slow modes</li>
      <li>Automatically switches between native slow modes (for 6h or less) and bot-enforced (for longer slow modes)</li>
      <li>Starboard</li>
      <li>And more!</li>
    </ul>
    
  </div>
</template>

<script lang="ts">
  import Alert from 'vue-material-design-icons/Alert.vue';

  export default {
    components: { Alert },
  };
</script>
