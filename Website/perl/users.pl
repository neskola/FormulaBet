#!/usr/bin/perl

use strict;
use warnings;
use Data::Dumper;

use Getopt::Long;
use DBI;
use JSON;

sub versionMessage {
    print "Script version 1.0\n\n";
    print "---------------------\n";
    print "Available db drivers:\n";
    my @ary = DBI->available_drivers();
    print join("\n", @ary), "\n";
}

sub main 
{
    my %opts;

    my $update;
    my $remove;
    my $user;
    my $passwd;

    GetOptions(\%opts,
	       'update|u' => \$update,
	       'user|n=s' => \$user,
	       'pass|p=s' => \$passwd,
	       'remove|r' => \$remove,
	       'version' => sub { versionMessage() });

    if ($update) {
	print "Update or add user : " . $user . "\n";
    } elsif ($remove) {
	print "Remove user : " . $user . "\n";
    }
}

main();

