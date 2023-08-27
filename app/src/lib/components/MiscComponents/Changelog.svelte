<script lang="ts">
    import { supabase } from '$lib/supabase';
    
    let logs:Array<Object> = []

    async function getLogs() {
    const { data, error } = await supabase
        .from('changelog')
        .select('*')
        .order('id', { ascending: false })
    if (error) {
        return;
    }
    logs = data
  }
  getLogs()
  </script>

  <h2 class='text-2xl mb-2'>Changelog</h2>
  <div class="changelog-container w-10/12 sm:w-1/2 lg:w-1/4 mx-auto border border-neutral rounded-lg">
    {#each logs as log, i (log.title)}
    <div class="card w-100 bg-base-100 shadow-xl">
      {#if log.image}  <figure><img src={log.image} alt={log.title}/></figure>{/if}
      <div class="card-body">
        <h2 class="card-title">
          {log.title}
          {#if i == 0}
          <div class="badge badge-secondary">NEW</div>
          {/if}
        </h2>
        <p>{log.description}</p>
        <div class="card-actions justify-between">
          <div class="badge badge-accent justify-normal">
            {new Date(log.creation_time).toLocaleString('en-GB', { day: '2-digit', month: '2-digit' })}
          </div>
          <div class="tag-container">
            {#each log.tags as tag}
            <div class="badge badge-accent badge-outline mx-1">{tag}</div>
            {/each}
          </div>
        </div>        
      </div>
    </div>
    {#if i != 0}
    <div class='divider'></div>
    {:else}
    <div class='divider'>NEW</div>
    {/if}

    {/each}
  </div>
  <style>
    .changelog-container {
      max-height: 50vh;
      overflow-y: auto;
  
      /* Custom scroll bar styles */
      scrollbar-width: thin;
      scrollbar-color: transparent  rgb(209 213 219);
  
      &::-webkit-scrollbar {
        width: 8px;
      }
  
      &::-webkit-scrollbar-thumb {
        background-color:  rgb(209 213 219);
        border-radius: 4px;
      }
  
      &::-webkit-scrollbar-track {
        background-color: transparent;
      }
    }
  </style>
  