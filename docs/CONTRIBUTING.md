## Contributing

First off, thank you for considering contributing to Sweeper Bot. It's a tool for the
moderators of r/DestinyTheGame's Discord Server to help with Moderation as well as
providing the users access to tools like their Destiny Game Data.

Please note that this project is released with a [Contributor Code of Conduct](https://github.com/r-DestinyTheGame/Sweeper-Bot/blob/master/docs/CODE_OF_CONDUCT.md).
By participating in this project you agree to abide by its terms.

### 1. Where do I go from here?

If you've noticed a bug or have a question that doesn't belong
[search the issue tracker](https://github.com/r-DestinyTheGame/Sweeper-Bot/issues?q=something)
to see if someone else in the community has already created a ticket.
If not, go ahead and [make one](https://github.com/r-DestinyTheGame/Sweeper-Bot/issues/new)!

### 2. Fork & create a branch

If this is something you think you can fix, then
[fork Active Admin](https://help.github.com/articles/fork-a-repo)
and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```sh
git checkout -b 325-add-new-feature
```

### 3. Get Development Environment running

For instructions on how to get the Development Environment running, please
see [this wiki](https://github.com/r-DestinyTheGame/Sweeper-Bot/wiki/Developer's-Corner) article.

### 4. Did you find a bug?

* **Ensure the bug was not already reported** by [searching all
  issues](https://github.com/r-DestinyTheGame/Sweeper-Bot/issues?q=).

* If you're unable to find an open issue addressing the problem, [open a new
  one](https://github.com/r-DestinyTheGame/Sweeper-Bot/issues/new). Be sure to
  include a **title and clear description**, as much relevant information as
  possible, and a **code sample** or an **executable test case** demonstrating
  the expected behavior that is not occurring.

### 5. Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help either
on here or [our discord](https://discord.gg/DestinyReddit) and tagging **@Bot Developer**;
everyone is a beginner at first :smile_cat:

### 6. Testing your changes

Be sure to test your changes in a dev environment. All PRs must be fully tested to
the best of your abilities.

### 7. Make a Pull Request

At this point, you should switch back to your master branch and make sure it's
up to date with Sweeper Bot's master branch:

```sh
git remote add upstream git@github.com:r-DestinyTheGame/Sweeper-Bot.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```sh
git checkout 325-add-new-feature
git rebase master
git push --set-upstream origin 325-add-new-feature
```

Finally, go to GitHub and
[make a Pull Request](https://help.github.com/articles/creating-a-pull-request)
:D

Travis CI will run our test suite. We care about quality, so your PR won't be merged
until all tests pass.

### 8. Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code
has changed, and that you need to update your branch so it's easier to merge.

To learn more about rebasing in Git, there are a lot of
[good](http://git-scm.com/book/en/Git-Branching-Rebasing)
[resources](https://help.github.com/articles/interactive-rebase),
but here's the suggested workflow:

```sh
git checkout 325-add-new-feature
git pull --rebase upstream master
git push --force-with-lease 325-add-new-feature
```

### 9. Merging a PR (maintainers only)

A PR can only be merged into master by a maintainer if:

* It is passing CI.
* It has been approved by at least two maintainers. If it was a maintainer who
  opened the PR, only one extra approval is needed.
* It has no requested changes.
* It is up to date with current master.

Any maintainer is allowed to merge a PR if all of these conditions are
met.