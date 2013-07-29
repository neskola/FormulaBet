#!/usr/bin/perl

use strict;
use warnings;
use Data::Dumper;

use LWP::UserAgent;
use HTTP::Cookies;
use HTML::Parse;
use HTML::Element;
use Getopt::Long;
use DBI;
use JSON;

my $f1prefix = "http://www.formula1.com";

my $ua = LWP::UserAgent->new();

my $cookies = HTTP::Cookies->new(
    file => "cookies.txt",
    autosave => 1,
    );

$ua->cookie_jar($cookies);

# Pretend to be Internet Explorer.
$ua->agent("Windows IE 10.0");

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

    GetOptions(\%opts,
	       'update|u' => \$update,
	       'version' => sub { versionMessage() });

    if ($update) {
	#my $response = getPage('http://www.formula1.com/races/calendar.html');
	#updateCircuitCalendar($response);
	my $response = getPage('http://www.formula1.com/teams_and_drivers/drivers/');
	updateDrivers($response);
    }
}

sub getPage {
    my $url = $_[0];
    my $response = $ua->get($url);

    if ($response->is_success) {
	print $url . "\n";
        print "Retrieved " . 
                      length($response->decoded_content) . 
                      " bytes of data.\n";
	HTML::Parse::parse_html($response->decoded_content);
    }
    else {
        print "Error: " . $response->status_line;	
    }
}

sub updateCircuitCalendar {
    my $calendarData = $_[0];

    my @elements = $calendarData->look_down('class', 'raceCalender'); # nice typo f1.com :)

    my @descendants = $elements[0]->descendants();

    my @circuits;

    my $row = 1;
    for (@descendants) {
	my $tagname = $_->tag;
	if ($tagname =~ 'td') {	    
	    my $tagtype = $_->attr_get_i('class');
	    my $taglink;
	    my $gp_id;

	    for(@{ $_->extract_links('a', 'href')}) {
		my($link, $element, $attr, $tag) = @$_;
		$taglink = $f1prefix.$link;
	    }

	    ($gp_id) = ($taglink =~ /^.*_{1}(\d{3})/);

	    if ($tagtype =~ 'raceLocation') {
	        my $gp_name = $_->as_text;
		my $detailpage = getPage($taglink);
		my $circuitinfobox = $detailpage->look_down('class', 'circuitInfoBox')->as_HTML;
		my $qualifyingtime = 
		    substr($detailpage->look_down('id', 'CT_Time_2_3')->attr_get_i('class'), 0, 22);
		my $racetime = 
		    substr($detailpage->look_down('id', 'CT_Time_3_1')->attr_get_i('class'), 0, 22);
		my $gp_year = substr($racetime, 0, 4);

		my $data = {
		    'gp_name' => $gp_name,
		    'gp_id' => $gp_id,
		    'gp_date' => $racetime,
		    'gp_qual_date' => $qualifyingtime,
		    'gp_year' => $gp_year,
		    'gp_number' => $row
		    #'gp_info' => $circuitinfobox		    
		};
		$row++;
		push(@circuits, "circuit" => $data);
	    }
	}
    }

    
    my $json_text = to_json(\@circuits, {utf8 => 1, pretty => 1});

    open (FILE, '>calendar.json');
    print FILE $json_text;
    close (FILE);
        
}

sub updateDrivers {
    my $driver_data = $_[0];

    my @elements = $driver_data->look_down('class', 'driverMugShot');

    my @descendants = $elements[0]->descendants();

    my @drivers = @descendants->find_by_tag_name('p');

    for (@drivers) {
	print Dumper($_)."\n";
    }
}

main();
