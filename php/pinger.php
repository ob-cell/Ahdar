<?php


$token = (isset($_GET['token']) && preg_match('/^[0-9a-f]{8}$/', $_GET['token'])) ? $_GET['token'] : false;

if (!$token) {
  $token = sprintf('%08x', crc32(microtime()));
}


$quadrant = ceil(date_create()->format('s') / 15); 
$previousQuadrant = $quadrant - 1 < 1 ? 4 : $quadrant - 1;
$key = 'pinger_'.$quadrant; 
$previousKey = 'pinger_'.$previousQuadrant;

$current = apcu_fetch($key);
$previous = apcu_fetch($previousKey);

if (!is_array($current)) {
  $current = array();
}

if (!is_array($previous)) {
  $previous = array();
}

// Add current token if not found
if (count($current) < 250 && !in_array($token, $current)) {
  $current[] = $token;
  apcu_store($key, $current, 31);
}


// Build return object: userCount, token
$output = array(
  'userCount' => count($current) > 250 ? '250+' : count(array_unique(array_merge($current, $previous))),
  'token' => $token,
);

header('Content-Type: application/json');
print json_encode($output);
exit;