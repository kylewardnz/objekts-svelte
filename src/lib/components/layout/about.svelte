<script lang="ts">
  import * as AlertDialog from '$components/ui/alert-dialog'
  import Button from '$components/ui/button/button.svelte'
  import { HelpCircle } from 'lucide-svelte'
</script>

<AlertDialog.Root>
  <AlertDialog.Trigger>
    <HelpCircle class="hover:scale-105 transition" />
  </AlertDialog.Trigger>
  <AlertDialog.Content>
    <AlertDialog.Header>
      <AlertDialog.Title>About</AlertDialog.Title>
      <AlertDialog.Description class="flex flex-col gap-4">
        <p>Not associated with Modhaus, Cosmo, tripleS, ARTMS or ODD EYE CIRCLE.</p>
        <p>
          Download Cosmo from the <a
            target="_blank"
            class="underline hover:text-primary transition"
            href="https://apps.apple.com/app/cosmo-the-gate/id1617337069"
          >
            App Store
          </a>
          or
          <a
            target="_blank"
            class="underline hover:text-primary transition"
            href="https://play.google.com/store/apps/details?id=com.modhaus.cosmo"
          >
            Google Play
          </a>
        </p>
      </AlertDialog.Description>
    </AlertDialog.Header>
    <AlertDialog.Footer>
      <AlertDialog.Cancel>Okay</AlertDialog.Cancel>
    </AlertDialog.Footer>
  </AlertDialog.Content>
</AlertDialog.Root>
