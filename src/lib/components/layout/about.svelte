<script lang="ts">
  import * as AlertDialog from '$components/ui/alert-dialog'
  import { HelpCircle } from 'lucide-svelte'
</script>

<AlertDialog.Root>
  <AlertDialog.Trigger>
    <HelpCircle class="hover:scale-105 transition" />
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>About</AlertDialog.Title>
      <AlertDialog.Description>
        <p>Not associated with Modhaus, Cosmo, tripleS, ARTMS or ODD EYE CIRCLE.</p>
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Okay</AlertDialog.Cancel>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
