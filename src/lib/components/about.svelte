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
  } from "$components/ui/alert-dialog";
	import { HelpCircle } from "lucide-svelte";
</script>

<AlertDialog>
  <AlertDialogTrigger>
    <HelpCircle class="hover:scale-105 transition" />
  </AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>About</AlertDialogTitle>
      <AlertDialogDescription>
        <p>Not associated with Modhaus, tripleS or ARTMS.</p>
        <p>Source can be found on <a class="underline underline-offset-2 hover:text-foreground" href="https://github.com/teamreflex/objekts-svelte" target="_blank">GitHub</a>.</p>
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogAction>Okay</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>