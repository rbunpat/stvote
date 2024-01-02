<script lang="ts">
    import { onMount, onDestroy } from 'svelte';
    import { writable } from 'svelte/store';
    import { createClient } from '@supabase/supabase-js';
  
    const supabaseUrl = 'https://mpibovldubkdqttudkdu.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1waWJvdmxkdWJrZHF0dHVka2R1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDQxMTA1MTgsImV4cCI6MjAxOTY4NjUxOH0.UFL1SVBNIv_VL9Sd6Caq0HYQe0XhvFCI5Yj9fLoy-YY';
    const supabase = createClient(supabaseUrl, supabaseKey);
  const contestantsTable = 'Contestant';

  // Create a store to manage the array of contestants
  const contestants = writable([]);

  let contestantsListener;

  onMount(async () => {
    // Fetch initial contestants data
    const { data, error } = await supabase
      .from(contestantsTable)
      .select('id, votes');

    if (error) {
      console.error('Error fetching contestants data:', error.message);
    } else {
      // Set the initial values for each contestant
      contestants.set(data);
    }

    // Subscribe to real-time updates for contestants
    contestantsListener = supabase
      .channel(`schema-db-changes`)
      .on('postgres_changes', { event: '*', schema: 'public' }, payload => {
        // Update the store with the new values
        contestants.update(oldContestants => {
          const index = oldContestants.findIndex(c => c.id === payload.new.id);

          if (index !== -1) {
            // Update the existing contestant
            oldContestants[index] = payload.new;
          } else {
            // Add the new contestant to the array
            oldContestants.push(payload.new);
          }

          return oldContestants;
        });
      })
      .subscribe();
  });

  onDestroy(() => {
    // Unsubscribe from real-time updates when the component is unmounted
    supabase.removeAllChannels()
  });
</script>

<main>
  {#each $contestants as { id, votes } (id)}
    <h1>Contestant {id}: {votes}</h1>
  {/each}
</main>
  
  
  <style>
    main {
      text-align: center;
      padding: 2rem;
    }
  
    h1 {
      font-size: 1.5rem;
      margin: 1rem 0;
    }
  </style>
  