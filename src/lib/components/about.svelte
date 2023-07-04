<script lang="ts">
  import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger
  } from '$components/ui/alert-dialog'
  import { HelpCircle } from 'lucide-svelte'
</script>

<AlertDialog>
  <AlertDialogTrigger>
    <HelpCircle class="hover:scale-105 transition" />
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>About</AlertDialogTitle>
      <AlertDialogDescription>
        <p>Not associated with Modhaus, Cosmo, tripleS, ARTMS or ODD EYE CIRCLE.</p>
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogAction>Okay</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
