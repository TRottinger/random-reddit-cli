#! /usr/bin/env node
import { Command } from 'commander/esm.mjs';
import fetch from 'node-fetch';
import open from 'open';

const program = new Command();

// Command line options
program
    .option('-print, --print-only', 'Return metadata only')
    .option('-sr, --subreddit <subreddit>', 'Specific subreddit to choose post from', 'all');

program.parse(process.argv);

const opts = program.opts();
const redditLink = 'https://reddit.com';
const fetchLink = (`${redditLink}/r/${opts.subreddit}/.json`);

// Fetch link and check for empty
const resp = await fetch(fetchLink);
const jsonData = await resp.json();

if (jsonData.data.dist == 0) {
    console.log('Subreddit does not exist or has no posts');
    process.exit(1);
}

// Generate random index and grab post at random index
const randomIndex = Math.floor(Math.random() * jsonData.data.children.length);
const post = jsonData.data.children[randomIndex];

if(opts.printOnly) {
    console.log(`
        Title: ${post.data.title}\n
        Link: ${redditLink}${post.data.permalink}
    `);
} else {
    open(`${redditLink}${post.data.permalink}`).then( () => {
        console.log('Success!');
    });
}



