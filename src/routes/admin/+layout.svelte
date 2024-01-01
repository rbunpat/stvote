<script lang="ts">
    import '../../app.css';
    
</script>

<div class="dark:bg-gray-900">
    <button data-drawer-target="default-sidebar" data-drawer-toggle="default-sidebar" aria-controls="default-sidebar" type="button" class="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600">
        <span class="sr-only">Open sidebar</span>
        <svg class="w-6 h-6" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
           <path clip-rule="evenodd" fill-rule="evenodd" d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zm0 10.5a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5a.75.75 0 01-.75-.75zM2 10a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 10z"></path>
        </svg>
     </button>
</div>
 
 <aside id="default-sidebar" class="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidenav">
   <div class="overflow-y-auto py-5 px-3 h-full bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
       <ul class="space-y-2">
           <li>
               <a href="/admin" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <span class="material-symbols-outlined">
                    data_usage
                    </span>
                   <span class="ml-3">Overview</span>
               </a>
           </li>
           <li>
            <a href="/admin" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <span class="material-symbols-outlined">
                    manage_accounts
                    </span>
                <span class="ml-3">Manage Contestants</span>
            </a>
        </li>
        <li>
            <a href="/admin/scoreboard" class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <span class="material-symbols-outlined">
                    scoreboard
                    </span>
                <span class="ml-3">Scoreboard</span>
            </a>
        </li>
           <ul class="pt-5 mt-5 space-y-2 border-t border-gray-200 dark:border-gray-700">
           <li>
            <form action="?/logout" method="POST">
                <button type="submit">
                    <a class="flex items-center p-2 text-base font-normal text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                        <span class="material-symbols-outlined">
                            logout
                            </span>
                        <span class="ml-3">Logout</span>
                    </a>
                </button>
            </form>
 
        </li>
   </div>

 </aside>

 <slot></slot>