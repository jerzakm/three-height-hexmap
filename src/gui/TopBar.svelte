<script>
  import { timeStore } from "../gui/stores.ts";

  let time;

  timeStore.subscribe(t => {
    time = t;
  });
</script>

<style>
  .time {
    position: fixed;
    z-index: 5;
    padding: 1rem;
    background-color: rgba(255, 255, 255, 0.171);
  }
</style>

<div class="time">
  <span>Time:</span>
  <h3>{time.hour}:{time.minute.toFixed(0)}</h3>
</div>
