<script>
  import { timeStore } from "../gui/stores.ts";

  let time;

  timeStore.subscribe(t => {
    time = t;
  });
</script>

<style>

</style>

<topbar class="fixed p-2 z-10 bg-gray-900 w-full flex flex-col items-start">
  <clock class="flex flex-col items-center">
    <span class="text-sm">World time:</span>
    <h3>
      {time.hour < 10 ? `0${time.hour}` : time.hour}:{time.minute - 1 < 10 ? `0${time.minute.toFixed(0)}` : time.minute.toFixed(0)}
    </h3>
  </clock>
</topbar>
