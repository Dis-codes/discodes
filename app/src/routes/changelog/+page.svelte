<script>
    export let logs = [
      { name: "test1", image: "https://amoeboids.com/wp-content/uploads/2020/02/Pointers-for-making-a-good-changelog.webp", description: "test1", author: "Noxyyk", time:"9.8.2023"},
      { name: "test2", image: "https://amoeboids.com/wp-content/uploads/2020/02/Pointers-for-making-a-good-changelog.webp", description: "test2", author: "Noxyyk", time:"9.8.2023" },
      { name: "test3", image: "https://amoeboids.com/wp-content/uploads/2020/02/Pointers-for-making-a-good-changelog.webp", description: "test3", author: "Noxyyk", time:"9.8.2023" }
    ];
  </script>
  
  <div class="changelog-container w-1/2 mx-auto">
    {#each logs as log (log.name)}
      <div class="log-item border p-4 my-2 rounded relative">
        <h4 class="text-lg font-bold mb-2 text-center">{log.name}</h4>
        <img class="w-full h-auto max-h-80 object-contain mb-2" src={log.image} alt={log.name} />
        <p>{log.description}</p>
        <div class="absolute bottom-0 right-0 text-sm text-gray-500 mr-1">
            Posted by <span class="font-bold">{log.author}</span> at {log.time}
          </div>
      </div>
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
  