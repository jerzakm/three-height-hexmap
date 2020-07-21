<script>
  import {
    timeStore,
    worldSettingsStore,
    meshRenderStatStore,
    meshGroupsRendered
  } from "../stores.ts";

  let worldSettings;
  let time;
  let meshGroupsOnScreen;

  timeStore.subscribe(t => {
    time = t;
  });

  worldSettingsStore.subscribe(ws => {
    worldSettings = ws;
  });
  meshGroupsRendered.subscribe(ws => {
    meshGroupsOnScreen = ws;
  });
</script>

<style>

</style>

<topbar class="fixed p-2 z-10 bg-gray-900 w-full flex flex-row items-start">
  <div class="flex flex-col items-center mr-10">
    <span class="text-sm">World time:</span>
    <h3>
      {time.hour < 10 ? `0${time.hour}` : time.hour}:{time.minute - 1 < 10 ? `0${time.minute.toFixed(0)}` : time.minute.toFixed(0)}
    </h3>
  </div>
  <div class="flex flex-col items-center mr-10">
    <span class="text-sm">World size:</span>
    <h3 class="text-sm">{worldSettings.width} x {worldSettings.height}</h3>
    <span class="text-xs">
      {worldSettings.width * worldSettings.height} tiles
    </span>
  </div>
  <div class="flex flex-col items-center mr-10">
    <span class="text-xs">
      1 mesh = {worldSettings.meshGroupSize} x {worldSettings.meshGroupSize}
      tiles
    </span>
    <span class="text-xs">
      {(worldSettings.width * worldSettings.height) / worldSettings.meshGroupSize ** 2}
      tilegroups total
    </span>
    <span class="text-xs">{meshGroupsOnScreen} tilegroup meshes on screen</span>
  </div>
</topbar>
