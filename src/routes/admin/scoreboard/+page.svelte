<script lang="ts">
	import { enhance } from '$app/forms';
    import autoAnimate from "@formkit/auto-animate"
	import '../../../app.css';
    export let data;
    $: bruh = data;
    $: sortedContestants = [...bruh.contestants].sort((a, b) => a.id - b.id);
</script>
<div class="antialiased bg-gray-50 dark:bg-gray-900 full-height">
    <!-- <div class="flex items-start justify-between"> -->

    <main class="p-4 md:ml-64 h-max pt-20">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
        
      </div>
      <section class="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
        <div class="mx-auto max-w-screen-xl px-4 lg:px-12">
            <!-- Start coding here -->
            <div class="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
                <div class="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
                    <div class="w-full md:w-1/2">
                    </div>
                    <div class="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                    </div>
                </div>
                <div class="overflow-x-auto">
                    <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" class="px-4 py-3">Name</th>
                                <th scope="col" class="px-4 py-3">Remove Vote</th>
                                <th scope="col" class="px-4 py-3">Add Vote</th>
                                <th scope="col" class="px-4 py-3">Vote Count</th>

                                <!-- <th scope="col" class="px-4 py-3">
                                    <span class="sr-only">Actions</span>
                                </th> -->
                            </tr>
                        </thead>
                        <tbody>
                        {#each sortedContestants as { name, percentage, votes, image, id }}
                            <tr class="border-b dark:border-gray-700">
                                <th scope="row" class="flex items-center px-4 py-2 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <img src={image} alt="iMac Front Image" class="w-auto h-8 mr-3">
                                    {name}</th>



                                <td class="px-4 py-3">
                                    <form method="POST" action="?/removeVote" use:enhance={() => {
                                        return async ({ update }) => {
                                          update({ reset: false });
                                        };
                                      }}>
                                    <input type="text" hidden value="{id}" name="id">
                                    <button type="submit">
                                    <span class="material-symbols-outlined">
                                        remove
                                        </span>
                                    </button>
                                </form>
                                </td>       

                                <td class="px-4 py-3">
                                    <form method="POST" action="?/addVote" use:enhance={() => {
                                        return async ({ update }) => {
                                          update({ reset: false });
                                        };
                                      }}>
                                    <input type="text" hidden value={id} name="id">
                                    <button type="submit">
                                    <span class="material-symbols-outlined">
                                        add
                                        </span>
                                    </button>
                                </form>
                                </td> 

                                <td use:autoAnimate class="px-4 py-3">{votes}</td>
                            </tr>

                            
                            {/each}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        </section>
      
      <div class="grid grid-cols-2 gap-4 mb-4">
    </main>
  </div>


